import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedUsers = users.map(user => ({
      ...user,
      telegramId: user.telegramId.toString()
    }));
    
    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
