import { executeQuery, executeTransaction } from '../db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { confession_id, anon_id } = await request.json();
    if (!confession_id || !anon_id) {
      return NextResponse.json({ error: 'confession_id and anon_id are required' }, { status: 400 });
    }

    // Check for duplicate report
    const checkQuery = `
      SELECT id FROM reports 
      WHERE confession_id = ? AND anon_id = ?
    `;
    const existingReports = await executeQuery(checkQuery, [confession_id, anon_id]);

    if (existingReports.length > 0) {
      return NextResponse.json({ error: 'Already reported' }, { status: 409 });
    }

    // Use transaction to insert report and update reports count
    const queries = [
      {
        query: `
          INSERT INTO reports (confession_id, anon_id)
          VALUES (?, ?)
        `,
        params: [confession_id, anon_id]
      },
      {
        query: `
          UPDATE confessions 
          SET reports_count = COALESCE(reports_count, 0) + 1
          WHERE id = ?
        `,
        params: [confession_id]
      }
    ];

    const results = await executeTransaction(queries);
    const reportData = results[0];

    return NextResponse.json({ data: reportData }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/report:', error);
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

    // Check if user has reported this confession
    const query = `
      SELECT id FROM reports 
      WHERE confession_id = ? AND anon_id = ?
    `;
    
    const reports = await executeQuery(query, [confession_id, anon_id]);
    const hasReported = reports.length > 0;

    return NextResponse.json({ hasReported }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
