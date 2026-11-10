import { SERVICES_DATA } from "@/content/services";
import { PRICING_HEADER, PRICING_TIERS } from "@/content/pricing";
import { PROCESS_STEPS, HOME_FAQS } from "@/content/home";
import { INDUSTRIES_DATA } from "@/content/industries";

/**
 * Looked up from official Google AI Gemini API documentation
 * (https://ai.google.dev/gemini-api/docs/models):
 * - Stable recommended Flash model for general chat/agentic tasks: `gemini-3.6-flash`
 * - Latest alias fallback: `gemini-flash-latest`
 */
export const RECOMMENDED_GEMINI_MODEL = "gemini-3.6-flash";
export const FALLBACK_GEMINI_MODEL = "gemini-flash-latest";

export const MAX_CHAT_MESSAGE_LENGTH = 500;
export const MAX_CHAT_CONVERSATION_MESSAGES = 12;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Section 7.1 — Grounded System Prompt:
 * Built dynamically from the typed content files so it answers ONLY about
 * EliavaTech services, pricing ranges, process, and timelines.
 */
export function buildEliavaSystemPrompt(): string {
  const servicesSummary = SERVICES_DATA.map(
    (s) =>
      `- ${s.title} (${s.startingPrice}): ${s.outcome} | Included: ${s.includedChecklist.join(", ")}`
  ).join("\n");

  const pricingSummary = PRICING_TIERS.map(
    (t) => `- [${t.category}] ${t.name}: ${t.price} (${t.unit}) — ${t.summary}`
  ).join("\n");

  const processSummary = PROCESS_STEPS.map(
    (p) => `${p.step}. ${p.title}: ${p.summary} (Deliverable: ${p.deliverable})`
  ).join("\n");

  const industriesSummary = INDUSTRIES_DATA.map(
    (ind) =>
      `- ${ind.title}: ${ind.bundle.map((b) => b.item).join(", ")}`
  ).join("\n");

  const faqSummary = HOME_FAQS.map(
    (f) => `Q: ${f.question}\nA: ${f.answer}`
  ).join("\n\n");

  return [
    "You are the official EliavaTech Assistant on the EliavaTech website.",
    "Voice & Tone: Formal, clear, confident, and helpful. Use short paragraphs or concise bullet points. Talk about the customer's business problem first, technology second. Avoid hype words like 'revolutionary' or 'cutting-edge'.",
    "",
    "STRICT GROUNDING & SAFETY RULES (Section 7.1):",
    "1. Answer ONLY about EliavaTech services, price ranges (taken strictly from the Pricing data below), 4-step process, industries served, and timelines.",
    "2. NEVER invent client names, past client case studies, metrics, testimonials, or unapproved discounts. If asked for examples of past work, explain that we showcase three working Concept Projects (Clinic booking system, Retail store e-commerce, Real estate lead CRM) on our /work page.",
    "3. When a visitor wants a quote, custom estimate, or project discussion, politely ask for their Name, Email address, and a brief summary of their business need.",
    "4. Refuse any off-topic requests (e.g., general coding homework, essays, trivia, politics, or unrelated companies) politely and redirect to EliavaTech services.",
    "5. For anything you cannot answer with certainty, offer our consultation booking link (/contact) or WhatsApp chat.",
    "",
    "=== ELIAVATECH SERVICES ===",
    servicesSummary,
    "",
    "=== FOUNDING CLIENT PRICING ===",
    pricingSummary,
    `Note: ${PRICING_HEADER.disclaimer}`,
    "",
    "=== HOW WE WORK (4-STEP PROCESS & TIMELINES) ===",
    processSummary,
    "Typical timelines: Standard websites & WhatsApp flows take ~2 weeks; E-commerce & custom CRM modules take 3 to 6 weeks. Response time: within 1 business day.",
    "",
    "=== INDUSTRIES SERVED ===",
    industriesSummary,
    "",
    "=== FREQUENTLY ASKED QUESTIONS ===",
    faqSummary,
  ].join("\n");
}

/**
 * Detects if the latest user message contains an email address so we can
 * capture the lead into the `Lead` table automatically during conversation.
 */
export function extractLeadDetailsFromConversation(messages: ChatTurn[]): {
  email: string;
  name: string;
  phone?: string;
  need: string;
} | null {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return null;

  const latestUserText = userMessages[userMessages.length - 1]?.content || "";
  const emailMatch = latestUserText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  if (!emailMatch) return null;

  const combinedUserText = userMessages.map((m) => m.content).join(" | ");
  const phoneMatch = combinedUserText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  const nameMatch = combinedUserText.match(
    /(?:my name is|i am|i'm|name:\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  );
  return {
    email: emailMatch[0].toLowerCase(),
    name: nameMatch?.[1]?.trim() || "Website Chat Visitor",
    phone: phoneMatch?.[0]?.trim(),
    need: combinedUserText.slice(0, 1000),
  };
}


export async function createGeminiStream(
  messages: ChatTurn[]
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const systemInstruction = buildEliavaSystemPrompt();
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const modelsToTry = [
    process.env.GEMINI_MODEL || RECOMMENDED_GEMINI_MODEL,
    FALLBACK_GEMINI_MODEL,
  ];

  let response: Response | null = null;

  for (const modelName of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
      apiKey
    )}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 450,
        },
      }),
    });

    if (res.ok && res.body) {
      response = res;
      break;
    }
  }

  if (!response || !response.body) {
    throw new Error("Gemini API request failed");
  }

  const upstreamBody = response.body;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr) as {
                candidates?: Array<{
                  content?: { parts?: Array<{ text?: string }> };
                }>;
              };
              const textChunk =
                parsed.candidates?.[0]?.content?.parts
                  ?.map((p) => p.text ?? "")
                  .join("") ?? "";
              if (textChunk) {
                controller.enqueue(encoder.encode(textChunk));
              }
            } catch {
              // Ignore malformed partial SSE frame
            }
          }
        }
      } catch (streamErr) {
        controller.error(streamErr);
        return;
      } finally {
        reader.releaseLock();
      }

      controller.close();
    },
  });
}

