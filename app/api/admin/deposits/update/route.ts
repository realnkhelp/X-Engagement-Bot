import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { transactionId, status, reason } = await req.json();

    if (!transactionId || !status) {
       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id: parseInt(transactionId) }
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'Pending') {
        throw new Error('Transaction already processed');
      }

      // If approved, add balance to user
      if (status === 'Completed') {
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            balance: { increment: transaction.amount }
          }
        });
      }

      // Update the transaction status
      await tx.transaction.update({
        where: { id: parseInt(transactionId) },
        data: {
          status: status,
          reason: reason || null
        }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Deposit Update Error:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
