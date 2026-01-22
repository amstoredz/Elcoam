import { saveOrder, getOrders, deleteOrder } from '@/lib/data';
import { Order } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('Telegram credentials are not set in environment variables');
}

async function sendTelegramNotification(order: Order) {
  const message = `
📦 *طلب جديد!*
------------------
👤 *العميل:* ${order.customer.firstName} ${order.customer.lastName}
📱 *الهاتف:* ${order.customer.phone}
📍 *العنوان:* ${order.customer.wilaya}, ${order.customer.baladiya}

🛒 *المنتجات:*
${order.products.map(p => `- ${p.name} (x${p.quantity}) - ${p.price} د.ج`).join('\n')}

💰 *الإجمالي:* ${order.total} د.ج
  `;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order: Order = {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...body
  };
  
  await saveOrder(order);
  await sendTelegramNotification(order);
  
  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (id) {
      await deleteOrder(id);
      return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'ID required' }, { status: 400 });
}