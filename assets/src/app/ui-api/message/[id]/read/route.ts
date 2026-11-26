import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../../../utils/fetch-retry';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const messageApi = process.env.MESSAGE_API || 'http://localhost:3006';
    const response = await fetch(`${messageApi}/message/${id}/read`, {
      method: 'PUT',
      headers: {
        'Cookie': `token=${token.value}`
      }
    });

    if( response.status !== 202) {
      throw new Error(`Failed to mark message as read: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    );
  }
} 