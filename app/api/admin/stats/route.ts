import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [totalUsers, pendingDeposits, activeTasks, userBalanceAggregate] = await Promise.all([
      prisma.user.count(),

      prisma.transaction.count({
        where: {
          type: 'Deposit',
          status: 'Pending'
        }
      }),

      prisma.task.count({
        where: {
          status: 'active'
        }
      }),

      prisma.user.aggregate({
        _sum: {
          balance: true
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        pendingDeposits,
        activeTasks,
        totalUserBalance: userBalanceAggregate._sum.balance || 0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
