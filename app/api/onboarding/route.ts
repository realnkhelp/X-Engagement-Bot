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

export async function POST(req: Request) {
  try {
    const { telegram_id, twitter_link } = await req.json();
    const connection = await pool.getConnection();

    try {
      const [settings]: any = await connection.execute('SELECT onboarding_bonus FROM settings LIMIT 1');
      const bonus = settings[0]?.onboarding_bonus || 500;

      await connection.execute(
        'UPDATE users SET twitter_link = ?, points = points + ? WHERE telegram_id = ?',
        [twitter_link, bonus, telegram_id]
      );

      connection.release();
      return NextResponse.json({ success: true, added_points: bonus });
    } catch (err) {
      connection.release();
      throw err;
    }
  } catch (error) {
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}