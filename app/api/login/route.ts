import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id, first_name, username } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID Missing' }, { status: 400 });
    }

    const [users]: any = await db.query('SELECT * FROM users WHERE telegram_id = ?', [id]);
    let finalUser = users[0];

    if (!finalUser) {
      await db.query(
        'INSERT INTO users (telegram_id, first_name, username, balance, points) VALUES (?, ?, ?, 0.00, 0.00)',
        [id, first_name, username || '']
      );
      const [newUser]: any = await db.query('SELECT * FROM users WHERE telegram_id = ?', [id]);
      finalUser = newUser[0];
    }

    const [settings]: any = await db.query('SELECT onboarding_bonus FROM settings LIMIT 1');
    const bonusAmount = settings[0]?.onboarding_bonus || 500;

    return NextResponse.json({ success: true, user: finalUser, rewardSetting: bonusAmount });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
