import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, categoryId, link, quantity, totalPoints } = body;

    if (!userId || !categoryId || !link || !quantity) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Transaction start
    await prisma.$transaction(async (tx) => {
      // 1. User check
      const user = await tx.user.findUnique({
        where: { telegramId: BigInt(userId) } // BigInt conversion zaroori hai
      });

      if (!user) throw new Error('User not found');

      // 2. Balance check
      if (user.points < Number(totalPoints)) {
        throw new Error('Insufficient Balance');
      }

      // 3. Category/Rate check
      const rate = await tx.taskRate.findFirst({
        where: { id: parseInt(categoryId) }
      });
      
      const categoryName = rate ? rate.category : 'General';
      const rewardPerTask = rate ? rate.points / 2 : 1; 

      // 4. Paisa kato
      await tx.user.update({
        where: { id: user.id },
        data: { points: { decrement: Number(totalPoints) } }
      });

      // 5. Task banao
      await tx.task.create({
        data: {
          creatorId: user.telegramId, // Ensure schema supports BigInt
          title: `Task by ${user.firstName}`,
          categoryId: categoryName,
          link: link,
          quantity: parseInt(quantity),
          reward: rewardPerTask,
          type: 'user',
          status: 'active'
        }
      });

      // 6. History add karo
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: Number(totalPoints),
          type: 'Task_Creation',
          status: 'Completed',
          method: 'Points'
        }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Task Create Error:", error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
