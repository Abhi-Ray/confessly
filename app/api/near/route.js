import { executeQuery } from '../db';
import { NextResponse } from 'next/server';

// Helper to get current timestamp minus 48 hours
function get48HoursAgo() {
  const now = new Date();
  now.setHours(now.getHours() - 48);
  return now;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    if (!city) {
      return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
    }

    // Calculate the timestamp for 48 hours ago
    const now = new Date();
    const hoursAgo48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Fetch confessions with status true, created within last 48 hours, matching city, sorted by latest
    const query = `
      SELECT * FROM confessions 
      WHERE status = true 
        AND city = ? 
        AND created_at >= ? 
        AND expires_at > NOW()
      ORDER BY created_at DESC
    `;
    
    const data = await executeQuery(query, [city, hoursAgo48.toISOString()]);

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/near:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
