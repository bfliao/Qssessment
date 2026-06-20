# Interviewer Agent

An AI-powered mock interviewer built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and the **OpenAI API**. Pick a role and practice interviews with an agent that asks questions, adapts difficulty, and gives feedback.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- TailwindCSS
- OpenAI Chat Completions API
- lucide-react icons

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then add your `OPENAI_API_KEY` to `.env.local`.

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/chat/route.ts   # OpenAI interviewer endpoint
  layout.tsx          # Root layout
  page.tsx            # Home page
  globals.css         # Tailwind styles
components/
  Chat.tsx            # Chat UI + role selector
```

## How It Works

The frontend in `components/Chat.tsx` sends the conversation and selected role
to `POST /api/chat`. The route injects an interviewer system prompt and calls
the OpenAI Chat Completions API, returning the assistant's reply.

## Deploy

Deploy to Vercel, set the `OPENAI_API_KEY` environment variable, and you're live.

## Next Ideas (for the hackathon)

- Stream responses for a typing effect
- Add resume upload to tailor questions
- Score answers and produce an end-of-interview report
- Voice input/output for realistic mock interviews
