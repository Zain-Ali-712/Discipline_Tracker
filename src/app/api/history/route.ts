import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import DailyRecord from '../../../models/DailyRecord';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const history = await DailyRecord.find({}).sort({ date: -1 });
    return NextResponse.json(history);
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Handle bulk migration (array) or single record update
    if (Array.isArray(body)) {
      for (const record of body) {
        await DailyRecord.findOneAndUpdate(
          { date: record.date },
          record,
          { upsert: true, new: true }
        );
      }
      return NextResponse.json({ message: 'History migrated successfully' });
    } else {
      const record = await DailyRecord.findOneAndUpdate(
        { date: body.date },
        body,
        { upsert: true, new: true }
      );
      return NextResponse.json(record);
    }
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
