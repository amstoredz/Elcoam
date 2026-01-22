import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasToken = !!process.env.TELEGRAM_TOKEN;
  const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
  
  return NextResponse.json({
    telegram: {
      connected: hasToken && hasChatId,
      hasToken,
      hasChatId
    }
  });
}
