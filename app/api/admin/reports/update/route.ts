import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { reportId, status, reason } = await req.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      'UPDATE reports SET status = ?, reason = ? WHERE id = ?',
      [status, reason || null, reportId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}