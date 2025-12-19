import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany();
    
    // Sirf zaroori data bhejo
    const formatted = assets.map(a => ({
      id: a.id.toString(),
      name: a.name,
      symbol: a.symbol.toUpperCase(), // e.g. USDT, TON
      iconUrl: a.logo
    }));

    return NextResponse.json({ success: true, assets: formatted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
