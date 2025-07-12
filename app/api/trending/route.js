import { executeQuery } from '../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Calculate the timestamp for 48 hours ago
    const now = new Date();
    const hoursAgo48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Fetch confessions with status true, created within last 48 hours, sorted by likes_count descending
    const query = `
      SELECT * FROM confessions 
      WHERE status = true 
        AND created_at >= ? 
        AND expires_at > NOW()
      ORDER BY likes_count DESC
    `;
    
    const data = await executeQuery(query, [hoursAgo48.toISOString()]);

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/trending:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
