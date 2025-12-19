import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Database se rates nikalo
    const rates = await prisma.taskRate.findMany({
      orderBy: { price: 'asc' } // Saste se mehnga sort karo
    });

    // Frontend ke liye data format karo
    const categories = rates.map(rate => ({
      id: rate.id.toString(), // ID ko string banao taaki select box mein dikhe
      name: rate.name,        // E.g. "Like", "Follow"
      priceUsd: rate.price,   // USD Price (0.005)
      pricePoints: rate.points // Points Price (10)
    }));

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories Fetch Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
