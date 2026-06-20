import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function systemPrompt(role: string) {
  return `You are a professional technical interviewer conducting a mock interview for a ${role} position.

Guidelines:
- Ask one focused question at a time and wait for the candidate's answer.
- Start with a brief intro, then progress from easy to harder questions.
- After each answer, give short, constructive feedback before the next question.
- Keep responses concise and conversational.
- Adapt difficulty based on the quality of answers.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const { role, messages } = (await req.json()) as {
    role: string;
    messages: ChatMessage[];
  };

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt(role || "Software Engineer") },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
