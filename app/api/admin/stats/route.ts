import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [users]: any = await db.query('SELECT COUNT(*) as count FROM users');
    
    const [pendingDeposits]: any = await db.query('SELECT COUNT(*) as count FROM transactions WHERE type = "Deposit" AND status = "Pending"');
    
    const [activeTasks]: any = await db.query('SELECT COUNT(*) as count FROM tasks WHERE status = "active"');
    
    const [userBalance]: any = await db.query('SELECT SUM(balance) as total FROM users');

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users[0].count,
        pendingDeposits: pendingDeposits[0].count,
        activeTasks: activeTasks[0].count,
        totalUserBalance: userBalance[0].total || 0
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}