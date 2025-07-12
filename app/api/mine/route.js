import { executeQuery } from '../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const anon_id = searchParams.get('anon_id');

    if (!anon_id) {
      return NextResponse.json(
        { error: 'anon_id is required' },
        { status: 400 }
      );
    }

    // Fetch confessions that match the user's anon_id, sorted by created_at descending
    const query = `
      SELECT * FROM confessions 
      WHERE status = true AND expires_at > NOW() AND anon_id = ?
      ORDER BY created_at DESC
    `;
    
    const data = await executeQuery(query, [anon_id]);

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/mine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 