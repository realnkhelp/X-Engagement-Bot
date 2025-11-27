import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [deposits]: any = await db.query(`
      SELECT t.*, u.first_name, u.username, u.avatar 
      FROM transactions t
      JOIN users u ON t.user_id = u.telegram_id
      WHERE t.type = 'Deposit'
      ORDER BY 
        CASE WHEN t.status = 'Pending' THEN 1 ELSE 2 END,
        t.created_at DESC
    `);
    
    return NextResponse.json({ success: true, deposits });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}