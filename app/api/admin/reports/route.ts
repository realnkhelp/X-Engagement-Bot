import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [reports]: any = await db.query(`
      SELECT 
        r.*,
        reporter.first_name as reporter_name,
        reporter.username as reporter_username,
        reporter.avatar as reporter_avatar,
        target.avatar as target_avatar,
        target.is_blocked as target_blocked,
        target.telegram_id as target_id
      FROM reports r
      LEFT JOIN users reporter ON r.user_id = reporter.telegram_id
      LEFT JOIN users target ON r.cheater_username = target.username OR r.cheater_username = CONCAT('@', target.username)
      ORDER BY 
        CASE WHEN r.status = 'pending' THEN 1 ELSE 2 END,
        r.created_at DESC
    `);

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}