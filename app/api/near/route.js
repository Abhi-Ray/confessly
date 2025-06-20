import { supabase } from '../db';
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
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', true)
      .eq('city', city)
      .gte('created_at', hoursAgo48.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching confessions:', error);
      return NextResponse.json({ error: 'Failed to fetch confessions' }, { status: 500 });
    }

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/near:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
