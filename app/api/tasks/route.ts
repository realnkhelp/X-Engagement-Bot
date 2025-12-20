import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');

    let userInternalId = null;

    // 1. User Identification (Safe Logic)
    // Ye check karega ki userId Telegram ID hai ya Database ID, taaki crash na ho
    if (userIdParam && userIdParam !== 'undefined' && userIdParam !== 'null') {
      try {
        // Pehle BigInt (Telegram ID) try karein
        const user = await prisma.user.findFirst({
          where: { telegramId: BigInt(userIdParam) },
          select: { id: true }
        });
        
        if (user) {
          userInternalId = user.id;
        } else {
          // Agar Telegram ID se nahi mila, to Internal ID try karein
          const userById = await prisma.user.findUnique({
            where: { id: Number(userIdParam) },
            select: { id: true }
          });
          if (userById) userInternalId = userById.id;
        }
      } catch (e) {
        console.error("User lookup error:", e);
      }
    }

    // 2. Fetch Active Tasks
    const tasksFromDb = await prisma.task.findMany({
      where: {
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { firstName: true, username: true, avatar: true, telegramId: true }
        },
        completions: true
      }
    });

    // 3. Filtering & Formatting
    const formattedTasks = tasksFromDb.map(task => {
      // Check completion status
      const isCompleted = userInternalId 
        ? task.completions.some(c => c.userId === userInternalId) 
        : false;
      
      const isQuotaFull = task.completedCount >= task.quantity;

      // Agar complete hai ya full hai, to mat dikhao
      if (isCompleted || isQuotaFull) {
        return null;
      }

      // Determine Type (User vs Admin)
      // Agar creatorId hai to 'user', nahi to 'admin'
      const taskType = task.creatorId ? 'user' : 'admin';

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
        type: taskType // Frontend isko use karke tab filter karega
      };
    }).filter(task => task !== null); // Remove null items

    return NextResponse.json({ success: true, tasks: formattedTasks });

  } catch (error) {
    console.error("Tasks API Error:", error);
    return NextResponse.json({ error: 'Server Error', tasks: [] }, { status: 500 });
  }
}
