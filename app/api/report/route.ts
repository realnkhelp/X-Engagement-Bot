import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, cheater_username, task_link, cheater_profile_link } = await req.json();

    if (!userId || !cheater_username) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO reports (user_id, cheater_username, task_link, cheater_profile_link, subject, message, status) VALUES (?, ?, ?, ?, "Cheating Report", "User reported suspicious activity", "pending")',
      [userId, cheater_username, task_link, cheater_profile_link]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    const [reports]: any = await db.query(`
      SELECT r.*, u.first_name, u.avatar 
      FROM reports r
      JOIN users u ON r.user_id = u.telegram_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
