import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../../utils/fetch-retry';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
    const body = await request.json();
    
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${bookingApi}/booking/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json(
          { errors: errorData.fieldErrors || ['Failed to update booking'] },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to update booking' },
          { status: response.status }
        );
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
    
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${bookingApi}/booking/${id}`, {
      method: 'DELETE',
      headers: {
        'Cookie': `token=${token.value}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete booking: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
    
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${bookingApi}/booking/${id}`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Cookie': `token=${token.value}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Failed to fetch booking: ${response.status}` 
      }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}