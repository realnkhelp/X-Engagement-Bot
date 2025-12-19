import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const telegramId = body.telegramId || body.id;
    const firstName = body.firstName || body.first_name;
    const username = body.username || body.username || '';
    const avatar = body.avatar || body.photo_url || '';
    const startParam = body.startParam || '';

    if (!telegramId) {
      return NextResponse.json({ error: 'ID Missing' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramId) },
      update: {
        firstName: firstName,
        username: username,
        avatar: avatar,
        lastLogin: new Date()
      },
      create: {
        telegramId: BigInt(telegramId),
        firstName: firstName,
        username: username,
        avatar: avatar,
        balance: 0.0,
        points: 0.0,
        isBlocked: false,
      }
    });

    const settings = await prisma.settings.findFirst();
    const bonusAmount = settings?.onboardingBonus || 500;

    const formattedUser = {
      ...user,
      telegramId: user.telegramId.toString(),
    };

    return NextResponse.json({ 
      success: true, 
      user: formattedUser, 
      rewardSetting: bonusAmount 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
