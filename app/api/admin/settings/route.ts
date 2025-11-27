import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await db.query('SELECT * FROM settings LIMIT 1');
    return NextResponse.json({ success: true, settings: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { bot_name, min_withdraw, onboarding_bonus, upi_id, maintenance_mode, maintenance_message } = await req.json();
    
    await db.query(`
      UPDATE settings 
      SET bot_name = ?, min_withdraw = ?, onboarding_bonus = ?, upi_id = ?, maintenance_mode = ?, maintenance_message = ? 
      WHERE id = 1
    `, [bot_name, min_withdraw, onboarding_bonus, upi_id, maintenance_mode ? 1 : 0, maintenance_message]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}