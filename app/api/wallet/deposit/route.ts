import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, amount, method, txid } = await req.json();

    if (!userId || !amount || !method || !txid) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO transactions (user_id, amount, type, status, method, txid) VALUES (?, ?, "Deposit", "Pending", ?, ?)',
      [userId, amount, method, txid]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}