import { executeQuery } from '../db';
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

    // Insert confession into MySQL
    const query = `
      INSERT INTO confessions (content, anon_id, city, ip, expires_at, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      content.trim(),
      anon_id || 'anonymous',
      city || null,
      ip || null,
      expires_at.toISOString().slice(0, 19).replace('T', ' '), // Format as MySQL datetime
      true
    ];

    const result = await executeQuery(query, params);

    return NextResponse.json({ 
      data: { id: result.insertId },
      status: true 
    }, { status: 201 });
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
    const query = `
      SELECT * FROM confessions 
      WHERE status = true AND expires_at > NOW()
      ORDER BY created_at DESC
    `;
    
    const data = await executeQuery(query);

    return NextResponse.json({ data, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
