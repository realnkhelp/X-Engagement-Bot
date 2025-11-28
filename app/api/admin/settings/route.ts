import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [settingsRows]: any = await db.query('SELECT * FROM settings LIMIT 1');
    const [assets]: any = await db.query('SELECT id, name, symbol as code, logo as iconUrl FROM assets');
    const [rates]: any = await db.query('SELECT * FROM task_rates');
    const [banners]: any = await db.query('SELECT id, image_url as imageUrl FROM banners');
    const [support]: any = await db.query('SELECT * FROM support_links');

    return NextResponse.json({ 
      success: true, 
      settings: settingsRows[0],
      currencies: assets,
      taskRates: rates,
      banners: banners,
      supportLinks: support
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === 'general') {
      const { telegramLink, maintenanceMode, maintenanceMessage, maintenanceDate, onboarding_bonus, point_currency_name } = body;
      await db.query(`
        UPDATE settings 
        SET telegram_channel = ?, maintenance_mode = ?, maintenance_message = ?, maintenance_date = ?, onboarding_bonus = ?, point_currency_name = ?
        WHERE id = 1
      `, [telegramLink, maintenanceMode ? 1 : 0, maintenanceMessage, maintenanceDate, onboarding_bonus, point_currency_name]);
    }
    
    if (type === 'add_currency') {
      await db.query('INSERT INTO assets (name, symbol, logo) VALUES (?, ?, ?)', [body.name, body.code, body.iconUrl]);
    }
    if (type === 'delete_currency') {
      await db.query('DELETE FROM assets WHERE id = ?', [body.id]);
    }

    if (type === 'add_rate') {
      await db.query('INSERT INTO task_rates (category, name, price, points) VALUES (?, ?, ?, ?)', [body.category, body.name, body.price, body.points]);
    }
    if (type === 'delete_rate') {
      await db.query('DELETE FROM task_rates WHERE id = ?', [body.id]);
    }

    if (type === 'add_banner') {
      await db.query('INSERT INTO banners (image_url) VALUES (?)', [body.imageUrl]);
    }
    if (type === 'delete_banner') {
      await db.query('DELETE FROM banners WHERE id = ?', [body.id]);
    }

    if (type === 'add_support') {
      await db.query('INSERT INTO support_links (title, url) VALUES (?, ?)', [body.title, body.url]);
    }
    if (type === 'delete_support') {
      await db.query('DELETE FROM support_links WHERE id = ?', [body.id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}