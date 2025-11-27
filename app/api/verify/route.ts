import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, taskId } = await req.json();

    const [tasks]: any = await db.query('SELECT * FROM tasks WHERE id = ? AND status = "active"', [taskId]);
    const task = tasks[0];

    if (!task) {
      return NextResponse.json({ error: 'Task not found or inactive' }, { status: 404 });
    }

    if (task.completed_count >= task.quantity) {
      return NextResponse.json({ error: 'Task limit reached' }, { status: 400 });
    }

    const [existing]: any = await db.query(
      'SELECT * FROM user_tasks WHERE user_id = ? AND task_id = ?',
      [userId, taskId]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already completed' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO user_tasks (user_id, task_id, status) VALUES (?, ?, "completed")',
      [userId, taskId]
    );

    await db.query(
      'UPDATE tasks SET completed_count = completed_count + 1 WHERE id = ?',
      [taskId]
    );

    await db.query(
      'UPDATE users SET points = points + ? WHERE telegram_id = ?',
      [task.reward, userId]
    );

    return NextResponse.json({ success: true, reward: task.reward });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
