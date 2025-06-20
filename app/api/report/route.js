import { supabase } from '../db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { confession_id, anon_id } = await request.json();
    if (!confession_id || !anon_id) {
      return NextResponse.json({ error: 'confession_id and anon_id are required' }, { status: 400 });
    }

    // Check for duplicate like
    const { data: existingLike, error: checkError } = await supabase
      .from('reports')
      .select('id')
      .eq('confession_id', confession_id)
      .eq('anon_id', anon_id)
      .single();

    if (existingLike) {
      return NextResponse.json({ error: 'Already report' }, { status: 409 });
    }
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: No rows found
      return NextResponse.json({ error: 'Error checking report' }, { status: 500 });
    }

    // Insert new like
    const { data: likeData, error: insertError } = await supabase
      .from('reports')
      .insert({ confession_id, anon_id, created_at: new Date().toISOString() })
      .select();
    if (insertError) {
      return NextResponse.json({ error: 'Failed to add report' }, { status: 500 });
    }

    // Fetch current likes_count
    const { data: confession, error: fetchError } = await supabase
      .from('confessions')
      .select('reports_count')
      .eq('id', confession_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch confession' }, { status: 500 });
    }

    // Increment and update
    const newLikesCount = (confession.reports_count || 0) + 1;
    const { data: updatedConfession, error: updateError } = await supabase
      .from('confessions')
      .update({ reports_count: newLikesCount })
      .eq('id', confession_id)
      .select();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update reports count' }, { status: 500 });
    }

    return NextResponse.json({ data: likeData }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
