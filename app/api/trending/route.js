import { supabase } from '../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Calculate the timestamp for 48 hours ago
    const now = new Date();
    const hoursAgo48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Fetch confessions with status true, created within last 48 hours, sorted by likes_count descending
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', true)
      .gte('created_at', hoursAgo48.toISOString())
      .order('likes_count', { ascending: false });

    if (error) {
      console.error('Error fetching trending confessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch trending confessions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/trending:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
