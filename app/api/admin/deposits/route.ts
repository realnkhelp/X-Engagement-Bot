import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deposits = await prisma.transaction.findMany({
      where: {
        type: 'Deposit'
      },
      orderBy: [
        { status: 'asc' }, 
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            firstName: true,
            username: true,
            avatar: true
          }
        }
      }
    });
    
    // Sort: Pending sabse upar
    deposits.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    });

    return NextResponse.json({ success: true, deposits });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
