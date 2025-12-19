import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Database check ko goli maaro, sidha login do
  return NextResponse.json({
    success: true,
    admin: {
      id: 'dummy_id',
      username: 'admin',
      role: 'Super Admin'
    }
  });
}
