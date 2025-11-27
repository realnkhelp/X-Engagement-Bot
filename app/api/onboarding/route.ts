import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { telegram_id, twitter_link } = await req.json();

    const [settings]: any = await db.query('SELECT onboarding_bonus FROM settings LIMIT 1');
    const bonus = settings[0]?.onboarding_bonus || 500;

    await db.query(
      'UPDATE users SET twitter_link = ?, points = points + ? WHERE telegram_id = ?',
      [twitter_link, bonus, telegram_id]
    );

    return NextResponse.json({ success: true, added_points: bonus });
  } catch (error) {
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
