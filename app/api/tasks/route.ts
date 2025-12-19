import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    // 1. Pehle Telegram ID se User ka asli Internal ID nikalo
    // Kyunki 'completions' table mein Internal ID save hoti hai, Telegram ID nahi.
    let userInternalId = null;
    if (telegramId) {
        try {
            // Telegram ID ko BigInt mein convert karke user dhundo
            const user = await prisma.user.findUnique({
                where: { telegramId: BigInt(telegramId) },
                select: { id: true }
            });
            if (user) userInternalId = user.id;
        } catch (e) {
            console.error("User ID conversion error:", e);
        }
    }

    // 2. Database se saare 'Active' tasks nikalo
    const tasksFromDb = await prisma.task.findMany({
      where: {
        status: 'active',
      },
      orderBy: { createdAt: 'desc' }, // Naya task sabse upar dikhega
      include: {
        creator: {
            select: { firstName: true, username: true, avatar: true }
        },
        completions: true // Check karne ke liye ki kisne complete kiya hai
      }
    });

    // 3. Data format aur Filter karo (Jo user kar chuka hai use list se hatao)
    const formattedTasks = tasksFromDb.map(task => {
        // Check: Kya user ne ye task pehle hi kar liya hai? (Internal ID match)
        const isCompleted = userInternalId ? task.completions.some(c => c.userId === userInternalId) : false;
        
        // Check: Kya task ki quantity full ho gayi hai?
        const isQuotaFull = task.completedCount >= task.quantity;

        // Agar task complete ho gaya hai ya full ho gaya hai, to list mein mat dikhao
        if (isCompleted || isQuotaFull) {
            return null; 
        }

        // Agar task bacha hai, to dikhao
        return {
            id: task.id.toString(), // BigInt ID ko string banao
            title: task.title,
            reward: Number(task.reward), // Decimal ko Number banao
            link: task.link,
            iconUrl: task.iconUrl || task.creator?.avatar || "", // Icon nahi hai to creator ka avatar dikhao
            category: task.categoryId || "General",
            status: task.status,
            creatorName: task.creator?.firstName || "Official Task",
            quantity: task.quantity,
            completedCount: task.completedCount
        };
    }).filter(task => task !== null); // Null walon ko filter karke hata do

    return NextResponse.json({ success: true, tasks: formattedTasks });

  } catch (error) {
    console.error("Task List Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
