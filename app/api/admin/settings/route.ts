import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    const [settingsRows]: any = await connection.execute('SELECT * FROM settings LIMIT 1');
    const [assets]: any = await connection.execute('SELECT id, name, symbol as code, logo as iconUrl FROM assets');
    const [rates]: any = await connection.execute('SELECT * FROM task_rates');
    const [banners]: any = await connection.execute('SELECT id, image_url as imageUrl FROM banners');
    const [support]: any = await connection.execute('SELECT * FROM support_links');

    connection.release();

    return NextResponse.json({ 
      success: true, 
      settings: settingsRows[0] || {},
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
    const connection = await pool.getConnection();

    try {
      if (type === 'general') {
        const { telegramLink, maintenanceMode, maintenanceMessage, maintenanceDate, onboarding_bonus, point_currency_name } = body;
        await connection.execute(`
          UPDATE settings 
          SET telegram_channel = ?, maintenance_mode = ?, maintenance_message = ?, maintenance_date = ?, onboarding_bonus = ?, point_currency_name = ?
          WHERE id = 1
        `, [telegramLink, maintenanceMode ? 1 : 0, maintenanceMessage, maintenanceDate, onboarding_bonus, point_currency_name]);
      }
      
      if (type === 'add_currency') {
        await connection.execute('INSERT INTO assets (name, symbol, logo) VALUES (?, ?, ?)', [body.name, body.code, body.iconUrl]);
      }
      if (type === 'delete_currency') {
        await connection.execute('DELETE FROM assets WHERE id = ?', [body.id]);
      }

      if (type === 'add_rate') {
        await connection.execute('INSERT INTO task_rates (category, name, price, points) VALUES (?, ?, ?, ?)', [body.category, body.name, body.price, body.points]);
      }
      if (type === 'delete_rate') {
        await connection.execute('DELETE FROM task_rates WHERE id = ?', [body.id]);
      }

      if (type === 'add_banner') {
        await connection.execute('INSERT INTO banners (image_url) VALUES (?)', [body.imageUrl]);
      }
      if (type === 'delete_banner') {
        await connection.execute('DELETE FROM banners WHERE id = ?', [body.id]);
      }

      if (type === 'add_support') {
        await connection.execute('INSERT INTO support_links (title, url) VALUES (?, ?)', [body.title, body.url]);
      }
      if (type === 'delete_support') {
        await connection.execute('DELETE FROM support_links WHERE id = ?', [body.id]);
      }

      connection.release();
      return NextResponse.json({ success: true });
    } catch (err) {
      connection.release();
      throw err;
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}