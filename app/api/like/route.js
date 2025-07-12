import { executeQuery, executeTransaction } from '../db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { confession_id, anon_id } = await request.json();
    if (!confession_id || !anon_id) {
      return NextResponse.json({ error: 'confession_id and anon_id are required' }, { status: 400 });
    }

    // Check for duplicate like
    const checkQuery = `
      SELECT id FROM likes 
      WHERE confession_id = ? AND anon_id = ?
    `;
    const existingLikes = await executeQuery(checkQuery, [confession_id, anon_id]);

    if (existingLikes.length > 0) {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 });
    }

    // Use transaction to insert like and update likes count
    const queries = [
      {
        query: `
          INSERT INTO likes (confession_id, anon_id)
          VALUES (?, ?)
        `,
        params: [confession_id, anon_id]
      },
      {
        query: `
          UPDATE confessions 
          SET likes_count = COALESCE(likes_count, 0) + 1
          WHERE id = ?
        `,
        params: [confession_id]
      }
    ];

    const results = await executeTransaction(queries);
    const likeData = results[0];

    return NextResponse.json({ data: likeData }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const confession_id = searchParams.get('confession_id');
    const anon_id = searchParams.get('anon_id');
    
    if (!confession_id || !anon_id) {
      return NextResponse.json({ error: 'confession_id and anon_id are required' }, { status: 400 });
    }

    // Check if user has liked this confession
    const query = `
      SELECT id FROM likes 
      WHERE confession_id = ? AND anon_id = ?
    `;
    
    const likes = await executeQuery(query, [confession_id, anon_id]);
    const hasLiked = likes.length > 0;

    return NextResponse.json({ hasLiked }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const confession_id = searchParams.get('confession_id');
    const anon_id = searchParams.get('anon_id');
    
    if (!confession_id || !anon_id) {
      return NextResponse.json({ error: 'confession_id and anon_id are required' }, { status: 400 });
    }

    // Check if like exists
    const checkQuery = `
      SELECT id FROM likes 
      WHERE confession_id = ? AND anon_id = ?
    `;
    const existingLikes = await executeQuery(checkQuery, [confession_id, anon_id]);

    if (existingLikes.length === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Use transaction to delete like and update likes count
    const queries = [
      {
        query: `
          DELETE FROM likes 
          WHERE confession_id = ? AND anon_id = ?
        `,
        params: [confession_id, anon_id]
      },
      {
        query: `
          UPDATE confessions 
          SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
          WHERE id = ?
        `,
        params: [confession_id]
      }
    ];

    await executeTransaction(queries);

    return NextResponse.json({ message: 'Like removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
