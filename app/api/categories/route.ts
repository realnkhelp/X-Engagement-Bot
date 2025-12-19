import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Prisma ka use karke data layenge
    const categories = await prisma.taskRate.findMany();
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
