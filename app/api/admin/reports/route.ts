import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: {
            firstName: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Extract unique cheater usernames to fetch their details
    const cheaterUsernames = reports
      .map(r => r.cheaterUsername.replace('@', ''))
      .filter((v, i, a) => a.indexOf(v) === i);

    const targetUsers = await prisma.user.findMany({
      where: {
        username: { in: cheaterUsernames }
      },
      select: {
        username: true,
        firstName: true,
        avatar: true,
        isBlocked: true,
        telegramId: true
      }
    });

    // Map target user data back to reports
    const enrichedReports = reports.map(report => {
      const cleanTargetUsername = report.cheaterUsername.replace('@', '');
      const targetUser = targetUsers.find(u => u.username === cleanTargetUsername);

      return {
        ...report,
        targetUser: targetUser ? {
          firstName: targetUser.firstName,
          avatar: targetUser.avatar,
          isBlocked: targetUser.isBlocked,
          telegramId: targetUser.telegramId.toString()
        } : null
      };
    });

    // Sort: Pending first
    enrichedReports.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    });

    return NextResponse.json({ success: true, reports: enrichedReports });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
