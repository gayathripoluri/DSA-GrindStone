const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
// A smaller model reloads into memory far faster after going idle, which matters
// on machines with limited RAM (an 8B model can take minutes to reload under
// memory pressure; this one reloads in seconds).
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

const REQUEST_TIMEOUT_MS = 25_000;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function ollamaChat(
  messages: ChatMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        // Keep the model resident between requests within a session so it
        // doesn't have to reload from disk on every turn.
        keep_alive: "30m",
        options: {
          temperature: options?.temperature ?? 0.6,
          num_predict: 120, // interviewer replies are 1-2 sentences; cap runaway generation
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama request failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    return data.message?.content?.trim() ?? "";
  } finally {
    clearTimeout(timer);
  }
}
