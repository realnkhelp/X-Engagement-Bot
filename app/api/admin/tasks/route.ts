import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, reward, quantity, link, iconUrl } = await req.json();

    await prisma.task.create({
      data: {
        title,
        reward: Number(reward),
        quantity: Number(quantity),
        link,
        iconUrl,
        status: 'active',
        type: 'admin',
        categoryId: 'General',
        creatorId: BigInt(123456789)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, reward, quantity, link, iconUrl, status } = await req.json();

    if (status !== undefined) {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: { status }
      });
    } else {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          title,
          reward: Number(reward),
          quantity: Number(quantity),
          link,
          iconUrl
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
