import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, balance, points, twitter_link, isBlocked } = await req.json();

    await db.query(
      'UPDATE users SET balance = ?, points = ?, twitter_link = ?, is_blocked = ? WHERE telegram_id = ?',
      [balance, points, twitter_link, isBlocked ? 1 : 0, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}