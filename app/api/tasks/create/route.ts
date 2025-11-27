import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, category_id, link, quantity, payment_method } = await req.json();

    const [users]: any = await db.query('SELECT balance, points FROM users WHERE telegram_id = ?', [userId]);
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [categories]: any = await db.query('SELECT * FROM categories WHERE id = ?', [category_id]);
    const category = categories[0];

    if (!category) {
      return NextResponse.json({ error: 'Invalid Category' }, { status: 400 });
    }

    const totalPointsCost = Number(category.price_points) * Number(quantity);
    const totalUsdCost = Number(category.price_usd) * Number(quantity);

    if (payment_method === 'POINTS') {
      if (Number(user.points) < totalPointsCost) {
        return NextResponse.json({ error: 'Insufficient Points' }, { status: 400 });
      }
      await db.query('UPDATE users SET points = points - ? WHERE telegram_id = ?', [totalPointsCost, userId]);
    } 
    else if (payment_method === 'WALLET') {
      if (Number(user.balance) < totalUsdCost) {
        return NextResponse.json({ error: 'Insufficient Wallet Balance' }, { status: 400 });
      }
      await db.query('UPDATE users SET balance = balance - ? WHERE telegram_id = ?', [totalUsdCost, userId]);
    } 
    else {
      return NextResponse.json({ error: 'Invalid Payment Method' }, { status: 400 });
    }

    const [result]: any = await db.query(
      'INSERT INTO tasks (creator_id, category_id, link, quantity, reward, status, completed_count) VALUES (?, ?, ?, ?, ?, "active", 0)',
      [userId, category_id, link, quantity, category.price_points]
    );

    return NextResponse.json({ success: true, taskId: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
