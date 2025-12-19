import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let [settings, assets, rates, banners, support] = await Promise.all([
      prisma.settings.findFirst(),
      prisma.asset.findMany(),
      prisma.taskRate.findMany(),
      prisma.banner.findMany(),
      prisma.supportLink.findMany()
    ]);

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          telegramChannel: '',
          maintenanceMode: false,
          maintenanceMessage: 'System under maintenance',
          maintenanceDate: new Date().toISOString(),
          onboardingBonus: 0,
          pointCurrencyName: 'Points'
        }
      });
    }

    const formattedAssets = assets.map(a => ({
      id: a.id,
      name: a.name,
      code: a.symbol,
      iconUrl: a.logo
    }));

    return NextResponse.json({ 
      success: true, 
      settings: settings,
      currencies: formattedAssets,
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

    try {
      if (type === 'general') {
        const { telegramLink, maintenanceMode, maintenanceMessage, maintenanceDate, onboardingBonus, pointCurrencyName } = body;
        
        const existingSettings = await prisma.settings.findFirst();
        
        if (existingSettings) {
          await prisma.settings.update({
            where: { id: existingSettings.id },
            data: {
              telegramChannel: telegramLink,
              maintenanceMode: maintenanceMode,
              maintenanceMessage: maintenanceMessage,
              maintenanceDate: maintenanceDate,
              onboardingBonus: parseFloat(onboardingBonus || '0'),
              pointCurrencyName: pointCurrencyName
            }
          });
        } else {
           await prisma.settings.create({
            data: {
              telegramChannel: telegramLink,
              maintenanceMode: maintenanceMode,
              maintenanceMessage: maintenanceMessage,
              maintenanceDate: maintenanceDate,
              onboardingBonus: parseFloat(onboardingBonus || '0'),
              pointCurrencyName: pointCurrencyName
            }
          });
        }
      }
      
      if (type === 'add_currency') {
        await prisma.asset.create({
          data: {
            name: body.name,
            symbol: body.code,
            logo: body.iconUrl
          }
        });
      }
      if (type === 'delete_currency') {
        await prisma.asset.delete({
          where: { id: body.id }
        });
      }

      if (type === 'add_rate') {
        await prisma.taskRate.create({
          data: {
            category: body.category,
            name: body.name,
            price: parseFloat(body.price),
            points: parseFloat(body.points)
          }
        });
      }
      if (type === 'delete_rate') {
        await prisma.taskRate.delete({
          where: { id: body.id }
        });
      }

      if (type === 'add_banner') {
        await prisma.banner.create({
          data: { imageUrl: body.imageUrl }
        });
      }
      if (type === 'delete_banner') {
        await prisma.banner.delete({
          where: { id: body.id }
        });
      }

      if (type === 'add_support') {
        await prisma.supportLink.create({
          data: {
            title: body.title,
            url: body.url
          }
        });
      }
      if (type === 'delete_support') {
        await prisma.supportLink.delete({
          where: { id: body.id }
        });
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ error: 'Operation Failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
