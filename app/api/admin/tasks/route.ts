import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return NextResponse.json({ success: true, tasks: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, reward, quantity, link, iconUrl } = await req.json();
    await db.query(
      'INSERT INTO tasks (title, reward, quantity, link, icon_url, status, type) VALUES (?, ?, ?, ?, ?, "active", "admin")',
      [title, reward, quantity, link, iconUrl]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, reward, quantity, link, iconUrl, status } = await req.json();
    
    if (status !== undefined) {
      await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status ? 'active' : 'inactive', id]);
    } else {
      await db.query(
        'UPDATE tasks SET title = ?, reward = ?, quantity = ?, link = ?, icon_url = ? WHERE id = ?',
        [title, reward, quantity, link, iconUrl, id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}