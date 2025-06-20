import { supabase } from '../db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { content, anon_id, city } = await request.json();

    // Get IP address from request headers
    let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip || null;
   

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Calculate expiration date (30 days from now)
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);

    // Insert confession into Supabase
    const { data, error } = await supabase
      .from('confessions')
      .insert([
        {
          content: content.trim(),
          anon_id: anon_id || 'anonymous',
          city: city || null,
          ip: ip || null,
          created_at: new Date().toISOString(),
          expires_at: expires_at.toISOString(),
          status: true,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting confession:', error);
      return NextResponse.json(
        { error: 'Failed to create confession' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Fetch all confessions, sorted by created_at descending
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching confessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch confessions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
