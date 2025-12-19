import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    if (!telegramId) return NextResponse.json({ error: 'ID required' });

    // Ensure telegramId valid BigInt hai
    let creatorIdBigInt;
    try {
        creatorIdBigInt = BigInt(telegramId);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // Database se user ke banaye hue tasks nikalo
    const tasks = await prisma.task.findMany({
      where: { creatorId: creatorIdBigInt },
      orderBy: { createdAt: 'desc' },
      include: {
        completions: {
          include: {
            user: {
              select: { firstName: true, username: true, avatar: true, twitterLink: true }
            }
          },
          take: 50 // Last 50 completers dikhao
        }
      }
    });

    // BigInt ko String me badal kar bhejo
    const formattedTasks = tasks.map((task) => ({
      id: task.id.toString(),
      categoryId: task.categoryId,
      completedCount: task.completedCount,
      quantity: task.quantity,
      link: task.link,
      status: task.status,
      reward: task.reward.toString(),
      completers: task.completions.map(c => ({
        name: c.user.firstName,
        username: c.user.username,
        avatar: c.user.avatar,
        twitterLink: c.user.twitterLink
      }))
    }));

    return NextResponse.json({ success: true, tasks: formattedTasks });

  } catch (error) {
    console.error("My Tasks Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
