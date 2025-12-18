import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const rates = await prisma.taskRate.findMany({
      orderBy: { price: 'asc' }
    });

    const categories = rates.map(rate => ({
      id: rate.id.toString(),
      name: rate.name,
      priceUsd: rate.price,
      pricePoints: rate.points
    }));

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
