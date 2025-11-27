import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    return NextResponse.json({ success: true, announcements: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, type } = await req.json();
    await db.query('INSERT INTO announcements (title, message, category) VALUES (?, ?, ?)', [title, description, type]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, type } = await req.json();
    await db.query('UPDATE announcements SET title = ?, message = ?, category = ? WHERE id = ?', [title, description, type, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query('DELETE FROM announcements WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}