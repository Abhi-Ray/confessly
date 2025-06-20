import { supabase } from '../db';
import { NextResponse } from 'next/server';

// POST: Add a comment to a confession
export async function POST(request) {
  try {
    const { confession_id, content, anon_id } = await request.json();

    // Validate input
    if (!confession_id || !content || !content.trim() || !anon_id) {
      return NextResponse.json({ error: 'confession_id, content, and anon_id are required' }, { status: 400 });
    }

    // Calculate expiration date (30 days from now)
    const created_at = new Date();
    const expires_at = new Date(created_at);
    expires_at.setDate(created_at.getDate() + 30);

    // Insert comment into Supabase
    const { data: commentData, error: insertError } = await supabase
      .from('comments')
      .insert([
        {
          confession_id,
          content: content.trim(),
          anon_id,
          created_at: created_at.toISOString(),
          expires_at: expires_at.toISOString(),
        },
      ])
      .select();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }

    // Increment comments_count in confessions table
    const { data: confession, error: fetchError } = await supabase
      .from('confessions')
      .select('comments_count')
      .eq('id', confession_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch confession' }, { status: 500 });
    }

    const newCommentsCount = (confession.comments_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('confessions')
      .update({ comments_count: newCommentsCount })
      .eq('id', confession_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update comments count' }, { status: 500 });
    }

    return NextResponse.json({ data: commentData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Get all comments for a confession (not expired)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const confession_id = searchParams.get('confession_id');
    if (!confession_id) {
      return NextResponse.json({ error: 'confession_id is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('confession_id', confession_id)
      .gt('expires_at', now)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
