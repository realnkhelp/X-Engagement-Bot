import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    let userInternalId = null;
    if (telegramId) {
      try {
        const user = await prisma.user.findUnique({
          where: { telegramId: BigInt(telegramId) },
          select: { id: true }
        });
        if (user) userInternalId = user.id;
      } catch (e) {
        console.error(e);
      }
    }

    const tasksFromDb = await prisma.task.findMany({
      where: {
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { firstName: true, username: true, avatar: true }
        },
        completions: true
      }
    });

    const formattedTasks = tasksFromDb.map(task => {
      const isCompleted = userInternalId ? task.completions.some(c => c.userId === userInternalId) : false;
      const isQuotaFull = task.completedCount >= task.quantity;

      if (isCompleted || isQuotaFull) {
        return null;
      }

      return {
        id: task.id,
        title: task.title,
        reward: task.reward.toString(),
        link: task.link,
        iconUrl: task.iconUrl || task.creator?.avatar || "",
        category: task.categoryId || "General",
        status: task.status,
        creatorName: task.creator ? task.creator.firstName : 'Official Task',
        creatorAvatar: task.creator ? task.creator.avatar : task.iconUrl,
        quantity: task.quantity,
        completedCount: task.completedCount,
        type: task.creatorId ? 'user' : 'admin'
      };
    }).filter(task => task !== null);

    return NextResponse.json({ success: true, tasks: formattedTasks });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
