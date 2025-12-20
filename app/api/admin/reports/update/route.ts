import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { reportId, status, reason } = await req.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.report.update({
      where: { id: Number(reportId) },
      data: {
        status: status,
        reason: reason || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
