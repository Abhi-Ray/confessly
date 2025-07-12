import { executeQuery, executeTransaction } from '../db';
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
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);

    // Format date for MySQL (YYYY-MM-DD HH:MM:SS)
    const mysqlDateTime = expires_at.toISOString().slice(0, 19).replace('T', ' ');
    
    console.log('Original ISO date:', expires_at.toISOString());
    console.log('MySQL formatted date:', mysqlDateTime);

    // Use transaction to insert comment and update comments count
    const queries = [
      {
        query: `
          INSERT INTO comments (confession_id, content, anon_id, expires_at)
          VALUES (?, ?, ?, ?)
        `,
        params: [confession_id, content.trim(), anon_id, mysqlDateTime]
      },
      {
        query: `
          UPDATE confessions 
          SET comments_count = COALESCE(comments_count, 0) + 1
          WHERE id = ?
        `,
        params: [confession_id]
      }
    ];

    const results = await executeTransaction(queries);
    const commentData = results[0];

    return NextResponse.json({ data: commentData }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comment:', error);
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

    const query = `
      SELECT * FROM comments 
      WHERE confession_id = ? AND expires_at > NOW()
      ORDER BY created_at ASC
    `;
    
    const comments = await executeQuery(query, [confession_id]);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
