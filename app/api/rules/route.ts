import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Fetch all rules
export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { id: 'desc' } // Or use displayOrder if you implement it later
    });
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// POST: Add a new rule (For Admin)
export async function POST(req: Request) {
  try {
    const { title, description, icon } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 });
    }

    const newRule = await prisma.rule.create({
      data: {
        title,
        description,
        icon
      }
    });

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// PUT: Update a rule (For Admin)
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

// DELETE: Remove a rule (For Admin)
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
