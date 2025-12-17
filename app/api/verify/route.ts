import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { userId, taskId } = await req.json();

    if (!userId || !taskId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const reward = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { telegramId: BigInt(userId) }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const task = await tx.task.findUnique({
        where: { id: parseInt(taskId) }
      });

      if (!task || task.status !== 'active') {
        throw new Error('Task not found or inactive');
      }

      if (task.completedCount !== null && task.completedCount >= task.quantity) {
        throw new Error('Task limit reached');
      }

      const existing = await tx.userTask.findFirst({
        where: {
          userId: user.id,
          taskId: parseInt(taskId)
        }
      });

      if (existing) {
        throw new Error('Already completed');
      }

      await tx.userTask.create({
        data: {
          userId: user.id,
          taskId: parseInt(taskId),
          status: 'completed'
        }
      });

      await tx.task.update({
        where: { id: parseInt(taskId) },
        data: { completedCount: { increment: 1 } }
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          points: { increment: task.reward },
          balance: { increment: task.reward }
        }
      });

      return task.reward;
    });

    await redis.del(`user:profile:${userId}`);

    return NextResponse.json({ success: true, reward: reward.toString() });

  } catch (error: any) {
    const errorMessage = error.message || 'Server Error';
    const status = errorMessage === 'Server Error' ? 500 : 400;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
