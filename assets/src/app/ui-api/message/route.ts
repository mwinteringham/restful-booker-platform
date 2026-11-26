import { NextResponse } from 'next/server';
import { fetchWithRetry as fetch } from '../../../utils/fetch-retry';

export async function GET() {
  try {
    const messageApi = process.env.MESSAGE_API || 'http://localhost:3006';

    const response = await fetch(`${messageApi}/message/`, {
      headers : {
        'Content-type': 'application/json'
      }
    });
    
    
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const messageApi = process.env.MESSAGE_API || 'http://localhost:3006';
    const body = await request.json();
    
    const response = await fetch(`${messageApi}/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    
    if (response.status !== 201) {
      const errorData = await response.json();
      return NextResponse.json(
        errorData.fieldErrors,
        { status: response.status }
      );
    } else {
      return NextResponse.json({ success: true });
    }
    
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
} 