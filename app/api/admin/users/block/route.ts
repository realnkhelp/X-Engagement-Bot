import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, isBlocked } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    await db.query(
      'UPDATE users SET is_blocked = ? WHERE telegram_id = ?',
      [isBlocked ? 1 : 0, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}