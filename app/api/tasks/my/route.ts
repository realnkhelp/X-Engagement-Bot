import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    const [tasks]: any = await db.query(`
      SELECT t.*, u.first_name, u.avatar 
      FROM tasks t 
      JOIN users u ON t.creator_id = u.telegram_id
      WHERE t.creator_id = ? 
      ORDER BY t.created_at DESC
    `, [userId]);

    for (const task of tasks) {
      const [completers]: any = await db.query(`
        SELECT u.first_name as name, u.username, u.avatar, u.twitter_link
        FROM user_tasks ut
        JOIN users u ON ut.user_id = u.telegram_id
        WHERE ut.task_id = ?
        ORDER BY ut.claimed_at DESC
      `, [task.id]);
      
      task.completers = completers;
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
