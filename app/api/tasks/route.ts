import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    if (!telegramId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let userInternalId;
    const cacheKeyProfile = `user:profile:${telegramId}`;
    const cachedProfile = await redis.get(cacheKeyProfile);

    if (cachedProfile) {
      userInternalId = JSON.parse(cachedProfile).id;
    } else {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        select: { id: true }
      });
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      userInternalId = user.id;
    }

    const tasksCacheKey = 'tasks:all_active';
    let tasksStr = await redis.get(tasksCacheKey);
    let allTasks;

    if (tasksStr) {
      allTasks = JSON.parse(tasksStr);
    } else {
      const tasksFromDb = await prisma.task.findMany({
        where: { status: 'active' },
        include: {
          creator: {
            select: { firstName: true, avatar: true, username: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      const safeTasks = tasksFromDb.map((task: any) => ({
        ...task,
        creatorId: task.creatorId ? task.creatorId.toString() : null,
        reward: task.reward.toString()
      }));

      await redis.set(tasksCacheKey, JSON.stringify(safeTasks), 'EX', 300);
      allTasks = safeTasks;
    }

    const userCompleted = await prisma.userTask.findMany({
      where: { userId: userInternalId },
      select: { taskId: true }
    });

    const completedSet = new Set(userCompleted.map(t => t.taskId));

    const finalTasks = allTasks
      .filter((t: any) => {
        const isCompleted = completedSet.has(t.id);
        const isQuotaFull = t.completedCount >= t.quantity;
        return !isCompleted && !isQuotaFull;
      })
      .map((t: any) => ({
        id: t.id,
        creatorName: t.creator ? t.creator.firstName : 'Official Task',
        creatorUsername: t.creator ? t.creator.username : '',
        creatorAvatar: t.creator ? t.creator.avatar : t.iconUrl,
        category: t.categoryId,
        completedCount: t.completedCount,
        quantity: t.quantity,
        reward: t.reward,
        type: t.type,
        link: t.link
      }));

    return NextResponse.json({ success: true, tasks: finalTasks });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
