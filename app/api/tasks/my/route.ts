import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    if (!telegramId) return NextResponse.json({ error: 'ID required' });

    const tasks = await prisma.task.findMany({
      where: { creatorId: BigInt(telegramId) },
      orderBy: { createdAt: 'desc' },
      include: {
        completions: {
          include: {
            user: {
              select: { firstName: true, username: true, avatar: true, twitterLink: true }
            }
          },
          take: 50 
        }
      }
    });

    // Fix: BigInt ko String mein badlo
    const formattedTasks = tasks.map((task) => ({
      id: task.id.toString(), // <-- YEH HAI ASLI FIX
      categoryId: task.categoryId,
      completedCount: task.completedCount,
      quantity: task.quantity,
      link: task.link,
      status: task.status,
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
