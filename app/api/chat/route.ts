import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import {
  createGeminiStream,
  extractLeadDetailsFromConversation,
  GeminiApiError,
  MAX_CHAT_CONVERSATION_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
  type ChatErrorType,
} from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { prisma } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";

const MAX_BODY_BYTES = 60_000;

const chatMessageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z
      .string()
      .trim()
      .min(1, "Message cannot be empty.")
      .max(
        MAX_CHAT_MESSAGE_LENGTH,
        `Each message must be under ${MAX_CHAT_MESSAGE_LENGTH} characters.`
      ),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z
      .string()
      .trim()
      .min(1, "Message cannot be empty.")
      .max(8000, "Assistant message too long."),
  }),
]);

const chatRequestSchema = z.object({
  sessionId: z
    .string()
    .max(100)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid session id.")
    .optional(),
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required.")
    .max(
      MAX_CHAT_CONVERSATION_MESSAGES,
      `Conversation limit of ${MAX_CHAT_CONVERSATION_MESSAGES} messages reached. Please book a consultation or message us on WhatsApp.`
    ),
  leadCapture: z
    .object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().toLowerCase().email().max(160),
      phone: z
        .string()
        .trim()
        .max(25)
        .regex(/^\+?[\d\s\-()]{7,25}$/)
        .optional(),
      need: z.string().trim().min(3).max(1000),
    })
    .optional(),
});

interface CapturedLead {
  name: string;
  email: string;
  phone?: string;
  need: string;
  sessionId?: string;
}

/**
 * Stores the lead, emails the team and pings the webhook.
 * Never throws. `received` is true only if the lead reached us by at least one
 * channel (database, team email or webhook), so callers never tell a visitor
 * their request was logged when nothing was saved or sent.
 */
async function captureChatLead(
  lead: CapturedLead
): Promise<{ leadId?: string; received: boolean }> {
  let leadId: string | undefined;

  if (prisma) {
    try {
      const created = await prisma.lead.create({
        data: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || null,
          service: "chat-enquiry",
          message: lead.need,
          source: "chat",
          status: "new",
        },
      });
      leadId = created.id;

      if (lead.sessionId) {
        try {
          await prisma.chatSession.upsert({
            where: { id: lead.sessionId },
            update: { leadId: created.id },
            create: { id: lead.sessionId, leadId: created.id },
          });
        } catch (err) {
          console.error("[/api/chat] Could not link chat session to lead:", err);
        }
      }
    } catch (err) {
      console.error("[/api/chat] Lead database save error:", err);
    }
  }

  const [email, webhookOk] = await Promise.all([
    sendLeadNotificationEmail({
      leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: "AI Assistant Lead Capture",
      message: lead.need,
      source: "chat",
    }),
    (async () => {
      const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
      if (!webhookUrl) return false;
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId ?? null,
            name: lead.name,
            email: lead.email,
            phone: lead.phone || null,
            message: lead.need,
            source: "chat",
            createdAt: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error(`[/api/chat] n8n webhook responded ${res.status}`);
        return res.ok;
      } catch (err) {
        console.error("[/api/chat] n8n webhook error:", err);
        return false;
      }
    })(),
  ]);

  if (email.error) console.warn("[/api/chat] Email warning:", email.error);

  return {
    leadId,
    received: Boolean(leadId || email.teamEmailSent || webhookOk),
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = await checkRateLimit(`chat:${ip}`, 15, 10 * 60 * 1000, ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          fallback: true,
          errorType: "rate_limited" satisfies ChatErrorType,
          error:
            "You have reached the message limit for now. Please continue on WhatsApp or book a free consultation call below.",
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          fallback: false,
          errorType: "invalid_request" satisfies ChatErrorType,
          error: "Your message is too large.",
        },
        { status: 413 }
      );
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          fallback: false,
          errorType: "invalid_request" satisfies ChatErrorType,
          error: parsed.error.issues[0]?.message || "Invalid chat message.",
        },
        { status: 400 }
      );
    }

    const { messages, sessionId, leadCapture } = parsed.data;

    // Explicit quote request from the chat widget's lead card.
    if (leadCapture) {
      const { leadId, received } = await captureChatLead({
        ...leadCapture,
        sessionId,
      });
      if (!received) {
        return NextResponse.json(
          {
            ok: false,
            fallback: true,
            errorType: "unavailable" satisfies ChatErrorType,
            error:
              "We could not log your request right now. Please message us on WhatsApp or use the contact page.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({
        ok: true,
        leadCaptured: true,
        leadId: leadId ?? null,
        message: `Thank you, ${leadCapture.name}. We have logged your request and will reply to ${leadCapture.email} within one business day.`,
      });
    }

    // If the visitor typed an email address in chat, capture it as a lead. This
    // runs after the response is sent so the reply is not delayed by email.
    const extractedLead = extractLeadDetailsFromConversation(messages);
    if (extractedLead) {
      after(async () => {
        const { received } = await captureChatLead({ ...extractedLead, sessionId });
        if (!received) {
          console.error("[/api/chat] Auto-captured lead was not saved or delivered.");
        }
      });
    }

    // Log the latest user message in the chat session if a database is available.
    const latestMessage = messages[messages.length - 1];
    const db = prisma;
    if (db && sessionId && latestMessage) {
      after(async () => {
        try {
          await db.chatSession.upsert({
            where: { id: sessionId },
            update: {},
            create: { id: sessionId },
          });
          await db.chatMessage.create({
            data: {
              sessionId,
              role: latestMessage.role,
              content: latestMessage.content,
            },
          });
        } catch (err) {
          console.error("[/api/chat] Could not log chat message:", err);
        }
      });
    }

    // Stream the reply from the Gemini API (server-side).
    const stream = await createGeminiStream(messages);

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    if (err instanceof GeminiApiError) {
      console.error(
        `[/api/chat] GeminiApiError status=${err.statusCode} type=${err.errorType} upstream=${err.upstreamStatus ?? "unknown"}: ${err.message}`
      );

      if (err.errorType === "rate_limited") {
        return NextResponse.json(
          {
            ok: false,
            fallback: true,
            errorType: "rate_limited" satisfies ChatErrorType,
            error:
              "Our AI assistant is experiencing high demand right now. Please message us on WhatsApp or book a call below.",
          },
          { status: 429 }
        );
      }

      if (err.errorType === "invalid_request") {
        return NextResponse.json(
          {
            ok: false,
            fallback: false,
            errorType: "invalid_request" satisfies ChatErrorType,
            error:
              "We could not process that request. Please shorten or rephrase your question.",
          },
          { status: 400 }
        );
      }
    } else {
      console.error("[/api/chat] Unexpected error:", err);
    }

    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        errorType: "unavailable" satisfies ChatErrorType,
        error:
          "Our AI assistant is temporarily unavailable. Please reach us directly on WhatsApp or book a free consultation call below.",
      },
      { status: 503 }
    );
  }
}
