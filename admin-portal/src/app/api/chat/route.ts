// src/app/api/chat/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// プロンプトを環境変数から取得
const systemPrompt = process.env.SYSTEM_PROMPT;

export async function POST(req: Request) {
  if (!systemPrompt) {
    return NextResponse.json(
      { error: 'System prompt is not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0]?.message?.content;
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}