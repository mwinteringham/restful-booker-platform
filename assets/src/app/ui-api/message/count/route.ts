import { NextResponse } from 'next/server';
import { fetchWithRetry as fetch } from '../../../../utils/fetch-retry';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get the original URL and headers
    const url = request.url;
    const headers = Object.fromEntries(request.headers);
    
    const messageApi = process.env.MESSAGE_API || 'http://localhost:3006';
    
    // Make the request with explicit no-cache headers
    const response = await fetch(`${messageApi}/message/count`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'User-Agent': 'NextJS-Direct-Test/1.0'
      }
    });
    
    const rawText = await response.text();
    
    try {
      const data = JSON.parse(rawText);
      return NextResponse.json({
        count: data.count
      });
    } catch (e) {
      return NextResponse.json({ 
        count: 0, 
        error: 'JSON parse error', 
        rawText: rawText 
      });
    }
  } catch (error) {
    return NextResponse.json({ count: 0, error: error });
  }
}
