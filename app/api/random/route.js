import { executeQuery } from '../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Calculate the timestamp for 48 hours ago
    const now = new Date();
    const hoursAgo48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Fetch confessions with status true, created within last 48 hours
    const query = `
      SELECT * FROM confessions 
      WHERE status = true 
        AND created_at >= ? 
        AND expires_at > NOW()
    `;
    
    const data = await executeQuery(query, [hoursAgo48.toISOString()]);

    // Shuffle the data array randomly
    const shuffled = Array.isArray(data)
      ? data.sort(() => Math.random() - 0.5)
      : [];

    return NextResponse.json({ data: shuffled, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/random:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
