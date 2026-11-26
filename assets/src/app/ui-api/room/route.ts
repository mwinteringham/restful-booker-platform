import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../utils/fetch-retry';

// Server-side API route that proxies requests to the room service
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    
    const roomApi = process.env.ROOM_API || 'http://localhost:3001';
    
    // Build the URL based on whether date parameters are provided
    let apiUrl = `${roomApi}/room/`;
    if (checkin && checkout) {
      apiUrl = `${roomApi}/room/?checkin=${checkin}&checkout=${checkout}`;
    }
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json([], { status: 500 });
  }
} 

export async function POST(
  request: Request,
) {
  try {
    const roomApi = process.env.ROOM_API || 'http://localhost:3001';
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { errors: ['Authentication required'] },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${roomApi}/room/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { errors: errorData.fieldErrors || ['Failed to create room'] },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { errors: ['An unexpected error occurred'] },
      { status: 500 }
    );
  }
}
