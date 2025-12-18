import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const cacheKey = 'system:settings';
    const cachedSettings = await redis.get(cacheKey);

    if (cachedSettings) {
      return NextResponse.json({ success: true, settings: JSON.parse(cachedSettings) });
    }

    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          botName: 'Task Bot',
          maintenanceMode: false,
          pointCurrencyName: 'Points'
        }
      });
    }

    await redis.set(cacheKey, JSON.stringify(settings), 'EX', 3600);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
