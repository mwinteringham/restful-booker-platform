import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../utils/fetch-retry';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const reportApi = process.env.REPORT_API || 'http://localhost:3005';
    const response = await fetch(`${reportApi}/report/`, {
      headers: {
        'Cookie': `token=${token.value}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json([], { status: 500 });
  }
} 