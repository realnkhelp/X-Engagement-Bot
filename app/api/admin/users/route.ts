import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [users]: any = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}