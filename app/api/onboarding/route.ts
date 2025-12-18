import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegramId, twitterLink } = body;

    // Prisma: telegramId is BigInt
    // twitterLink maps to twitterLink in schema (camelCase)

    if (!telegramId || !twitterLink) {
      return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
    }

    // Default bonus if settings not found
    let bonus = 500;

    // Fetch settings for dynamic bonus
    const settings = await prisma.settings.findFirst();
    if (settings && settings.onboardingBonus) {
      bonus = settings.onboardingBonus;
    }

    // Update user and add transaction log
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { telegramId: BigInt(telegramId) }
      });

      if (!user) throw new Error('User not found');

      await tx.user.update({
        where: { id: user.id },
        data: {
          twitterLink: twitterLink,
          points: { increment: bonus },
          balance: { increment: bonus }
        }
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: bonus,
          type: 'Bonus',
          status: 'Completed',
          method: 'System'
        }
      });
    });

    return NextResponse.json({ success: true, addedPoints: bonus });

  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
