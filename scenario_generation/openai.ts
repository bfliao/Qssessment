import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Lazily create a singleton OpenAI-compatible client.
 *
 * Set OPENAI_BASE_URL to point at any OpenAI-spec server (e.g. a vLLM instance);
 * in that case OPENAI_API_KEY is optional (a placeholder is used).
 * When talking to api.openai.com, OPENAI_API_KEY is required.
 */
export function getOpenAI(): OpenAI {
  const baseURL = process.env.OPENAI_BASE_URL;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!baseURL && !apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set (or set OPENAI_BASE_URL for a self-hosted server)."
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey: apiKey || "not-needed",
      ...(baseURL ? { baseURL } : {}),
    });
  }
  return client;
}

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Call the chat model in strict JSON mode and parse the result.
 * Throws if the response is empty or not valid JSON.
 */
export async function chatJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.7
): Promise<T> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Model returned an empty response.");
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Model did not return valid JSON: ${raw.slice(0, 200)}`);
  }
}
