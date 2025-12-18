import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, icon } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.rule.create({
      data: {
        title,
        description,
        icon
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, icon } = await req.json();

    await prisma.rule.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        icon
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.rule.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
