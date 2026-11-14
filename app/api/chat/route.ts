import { NextRequest, NextResponse } from "next/server";
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
import { prisma } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";

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
  sessionId: z.string().max(100).optional(),
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
      email: z.string().trim().email().max(160),
      phone: z.string().trim().max(25).optional(),
      need: z.string().trim().min(3).max(1000),
    })
    .optional(),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

async function captureChatLead(lead: {
  name: string;
  email: string;
  phone?: string;
  need: string;
  sessionId?: string;
}) {
  let savedLeadId: string | undefined;

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
      savedLeadId = created.id;

      if (lead.sessionId) {
        await prisma.chatSession
          .upsert({
            where: { id: lead.sessionId },
            update: { leadId: created.id },
            create: { id: lead.sessionId, leadId: created.id },
          })
          .catch(() => null);
      }
    } catch (err) {
      console.error("[/api/chat] Prisma lead save error:", err);
    }
  }

  await sendLeadNotificationEmail({
    leadId: savedLeadId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    service: "AI Assistant Lead Capture",
    message: lead.need,
  }).catch(() => null);

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: savedLeadId ?? null,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        message: lead.need,
        source: "chat",
        createdAt: new Date().toISOString(),
      }),
    }).catch(() => null);
  }

  return savedLeadId;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`chat:${ip}`, 15, 10 * 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          fallback: true,
          errorType: "rate_limited" satisfies ChatErrorType,
          error:
            "You have reached the message limit for now. Please continue on WhatsApp or book a free consultation call below.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue =
        parsed.error.issues[0]?.message || "Invalid chat message.";
      return NextResponse.json(
        {
          ok: false,
          fallback: false,
          errorType: "invalid_request" satisfies ChatErrorType,
          error: firstIssue,
        },
        { status: 400 }
      );
    }

    const { messages, sessionId, leadCapture } = parsed.data;

    // If explicit leadCapture payload was submitted from the chat widget
    if (leadCapture) {
      const leadId = await captureChatLead({ ...leadCapture, sessionId });
      return NextResponse.json({
        ok: true,
        leadCaptured: true,
        leadId: leadId ?? null,
        message: `Thank you, ${leadCapture.name}. We have logged your request and will reply to ${leadCapture.email} within one business day.`,
      });
    }

    // Automatically extract and save lead if visitor typed their email in the chat
    const extractedLead = extractLeadDetailsFromConversation(messages);
    if (extractedLead) {
      await captureChatLead({ ...extractedLead, sessionId });
    }

    // Log latest user message in ChatSession if DB is available
    const latestMessage = messages[messages.length - 1];
    const db = prisma;
    if (db && sessionId && latestMessage) {
      await db.chatSession
        .upsert({
          where: { id: sessionId },
          update: {},
          create: { id: sessionId },
        })
        .then(() =>
          db.chatMessage.create({
            data: {
              sessionId,
              role: latestMessage.role,
              content: latestMessage.content,
            },
          })
        )
        .catch(() => null);
    }

    // Stream reply from Gemini API server-side
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
