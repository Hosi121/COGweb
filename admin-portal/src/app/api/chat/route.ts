// src/app/api/chat/route.ts
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// プロンプトを環境変数から取得
const systemPrompt = process.env.SYSTEM_PROMPT;

export async function POST(request: Request) {
  if (!systemPrompt) {
    return NextResponse.json(
      { error: 'System prompt is not configured' },
      { status: 500 }
    );
  }

  try {
    const { message, systemPrompt } = await request.json();

    console.log('Received message:', message);
    console.log('System prompt:', systemPrompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.3, // より決定論的な応答に
      max_tokens: 1000,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 0.9
    });

    const response = completion.choices[0].message.content;
    console.log('AI response:', response);

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // レスポンスに「浜松市の職員ではない」などの不適切な文言が含まれていないかチェック
    if (response.includes('浜松市の職員ではない') || 
        response.includes('市役所にお問い合わせ')) {
      return NextResponse.json({
        message: '申し訳ありませんが、ただいま情報の取得に問題が発生しています。少し時間をおいて再度お試しください。'
      });
    }

    return NextResponse.json({
      message: response,
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'チャットの処理中にエラーが発生しました';

    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'すみません、現在応答に問題が発生しています。しばらく経ってから再度お試しください。'
      },
      { status: 500 }
    );
  }
}