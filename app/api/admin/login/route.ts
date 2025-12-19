import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const admin = await prisma.admin.findUnique({
      where: { username: username }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 401 });
    }

    if (admin.password !== password) {
      return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
