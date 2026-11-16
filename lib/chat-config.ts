/**
 * Client-safe chat constants and types. Kept separate from `lib/gemini.ts`
 * (server-only: pulls in all site content) so client components do not
 * bundle the system-prompt builder.
 */
export type ChatErrorType = "rate_limited" | "unavailable" | "invalid_request";

export const MAX_CHAT_MESSAGE_LENGTH = 500;
export const MAX_CHAT_CONVERSATION_MESSAGES = 30;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}
