import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    const query = `
      SELECT 
        t.*, 
        u.first_name as creator_name, 
        u.username as creator_username,
        u.avatar as creator_avatar
      FROM tasks t
      LEFT JOIN users u ON t.creator_id = u.telegram_id
      WHERE t.status = 'active'
      AND t.completed_count < t.quantity
      AND t.id NOT IN (SELECT task_id FROM user_tasks WHERE user_id = ?)
      ORDER BY t.created_at DESC
    `;

    const [tasks]: any = await db.query(query, [userId]);

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
