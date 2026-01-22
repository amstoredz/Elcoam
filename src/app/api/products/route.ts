import { getProducts, saveProduct, deleteProduct } from '@/lib/data';
import { Product } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product: Product = {
    id: body.id || Math.random().toString(36).substr(2, 9),
    ...body
  };
  await saveProduct(product);
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}