import { NextResponse } from 'next/server';
import { fetchWithRetry as fetch } from '../../../../utils/fetch-retry';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Forward the validation request to the auth service
    const authApi = process.env.AUTH_API || 'http://localhost:3004';
    const response = await fetch(`${authApi}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 