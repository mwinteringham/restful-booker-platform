import { NextResponse } from 'next/server';
import { fetchWithRetry as fetch } from '../../../../../utils/fetch-retry';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomid: string }> }
) {
  try {
    const { roomid } = await params;
    
    // Forward the request to the report service
    const reportApi = process.env.REPORT_API || 'http://localhost:3005';
    const response = await fetch(`${reportApi}/report/room/${roomid}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch room report: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data.report || []);
  } catch (error) {
    console.error('Error fetching room report:', error);
    return NextResponse.json([], { status: 500 });
  }
} 