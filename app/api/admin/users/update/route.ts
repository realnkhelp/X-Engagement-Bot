import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { telegramId, balance, points, twitterLink, isBlocked } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    await prisma.user.update({
      where: { telegramId: BigInt(telegramId) },
      data: {
        balance: parseFloat(balance),
        points: parseFloat(points),
        twitterLink: twitterLink,
        isBlocked: isBlocked
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
