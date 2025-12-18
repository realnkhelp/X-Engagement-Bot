import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, username, password, role } = await req.json();

    if (!username || !password) {
       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.admin.create({
      data: {
        name,
        username,
        password, // In a real app, hash this password!
        role,
        status: 'Active'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();

    await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.admin.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
