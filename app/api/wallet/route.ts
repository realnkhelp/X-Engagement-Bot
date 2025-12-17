import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    if (!telegramId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const assetsCacheKey = 'system:assets';
    let assetsStr = await redis.get(assetsCacheKey);
    let dbAssets;

    if (assetsStr) {
      dbAssets = JSON.parse(assetsStr);
    } else {
      dbAssets = await prisma.asset.findMany();
      await redis.set(assetsCacheKey, JSON.stringify(dbAssets), 'EX', 3600);
    }

    const userAssets = dbAssets.map((asset: any) => ({
      ...asset,
      balance: asset.symbol === 'USDT' ? user.balance : 0
    }));

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const safeTransactions = transactions.map((t) => ({
      ...t,
      amount: t.amount.toString(),
      createdAt: t.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      balance: user.balance.toString(),
      assets: userAssets,
      history: safeTransactions
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
