import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, categoryId, link, quantity, totalPoints } = body;

    if (!userId || !categoryId || !link || !quantity) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { telegramId: BigInt(userId) }
      });

      if (!user) throw new Error('User not found');

      if (user.points < Number(totalPoints)) {
        throw new Error('Insufficient Balance');
      }

      const rate = await tx.taskRate.findFirst({
        where: { id: parseInt(categoryId) } // Assuming categoryId is passed as ID from frontend
      });
      
      const categoryName = rate ? rate.category : 'General';
      const rewardPerTask = rate ? rate.points / 2 : 1; 

      await tx.user.update({
        where: { id: user.id },
        data: { points: { decrement: Number(totalPoints) } }
      });

      await tx.task.create({
        data: {
          creatorId: user.telegramId,
          title: `Task by ${user.firstName}`,
          categoryId: categoryName,
          link: link,
          quantity: parseInt(quantity),
          reward: rewardPerTask,
          type: 'user',
          status: 'active'
        }
      });

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
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
