import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM payment_methods ORDER BY id DESC');
    return NextResponse.json({ success: true, methods: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, minimum, status } = await req.json();
    await db.query(
      'INSERT INTO payment_methods (name, minimum, status) VALUES (?, ?, ?)',
      [name, minimum, status]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, minimum, status } = await req.json();
    await db.query(
      'UPDATE payment_methods SET name = ?, minimum = ?, status = ? WHERE id = ?',
      [name, minimum, status, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query('DELETE FROM payment_methods WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}