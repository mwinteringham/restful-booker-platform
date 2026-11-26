import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../utils/fetch-retry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomid = searchParams.get('roomid');

    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!roomid) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
    const response = await fetch(`${bookingApi}/booking/?roomid=${roomid}`, {
      headers: {
        'Cookie': `token=${token.value}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
    const response = await fetch(`${bookingApi}/booking/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(await request.json())
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json(
          { errors: errorData.fieldErrors || ['Failed to create booking'] },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to create booking' },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();
    return NextResponse.json(data.booking || [], { status: response.status});
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json([], { status: 500 });
  }
}