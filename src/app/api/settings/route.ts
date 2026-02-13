import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'global_settings' });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const settings = await Settings.findOneAndUpdate(
      { key: 'global_settings' },
      { ...body, key: 'global_settings' },
      { upsert: true, new: true }
    );
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
