import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { transactionId, status, reason } = await req.json();

    const [txs]: any = await db.query('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    const transaction = txs[0];

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== 'Pending') {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
    }

    if (status === 'Completed') {
      await db.query(
        'UPDATE users SET balance = balance + ? WHERE telegram_id = ?',
        [transaction.amount, transaction.user_id]
      );
    }

    await db.query(
      'UPDATE transactions SET status = ?, reason = ? WHERE id = ?',
      [status, reason || null, transactionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}