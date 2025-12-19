import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { firstName: true, username: true, telegramId: true }
        }
      }
    });

    const formattedTasks = tasks.map(task => ({
      id: task.id.toString(),
      title: task.title,
      link: task.link,
      quantity: task.quantity,
      completed: task.completedCount,
      reward: task.reward,
      category: task.categoryId,
      status: task.status,
      creator: task.creator ? {
        name: task.creator.firstName,
        username: task.creator.username,
        id: task.creator.telegramId.toString()
      } : { name: 'Admin', username: 'System', id: '0' },
      createdAt: task.createdAt
    }));

    return NextResponse.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, link, quantity, reward, category } = body;

    await prisma.task.create({
      data: {
        creatorId: BigInt(0),
        title,
        link,
        quantity: Number(quantity),
        reward: Number(reward),
        categoryId: category || 'General',
        type: 'system',
        status: 'active'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, action, status, link } = body;

    if (action === 'status') {
      await prisma.task.update({
        where: { id: Number(id) },
        data: { status: status }
      });
    }

    if (action === 'edit') {
      await prisma.task.update({
        where: { id: Number(id) },
        data: { link: link }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await prisma.task.delete({
      where: { id: Number(body.id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
