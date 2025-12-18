import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST: Create a new report
export async function POST(req: Request) {
  try {
    const { telegramId, cheaterUsername, taskLink, cheaterProfileLink } = await req.json();

    if (!telegramId || !cheaterUsername) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.report.create({
      data: {
        reporterId: user.id, // Linking internal ID
        cheaterUsername: cheaterUsername,
        taskLink: taskLink || '',
        cheaterProfileLink: cheaterProfileLink || '',
        subject: 'Cheating Report',
        message: 'User reported suspicious activity',
        status: 'Pending'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// GET: Fetch reports by a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('userId');

    if (!telegramId) {
      return NextResponse.json({ error: 'User ID Missing' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reports = await prisma.report.findMany({
      where: { reporterId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { firstName: true, avatar: true }
        }
      }
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
