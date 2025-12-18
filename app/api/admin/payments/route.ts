import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, methods });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, minimum, status } = await req.json();
    
    await prisma.paymentMethod.create({
      data: {
        name,
        minimum,
        status
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, minimum, status } = await req.json();

    await prisma.paymentMethod.update({
      where: { id: parseInt(id) },
      data: {
        name,
        minimum,
        status
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
    await prisma.paymentMethod.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
