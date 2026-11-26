import { NextResponse } from 'next/server';
import { fetchWithRetry as fetch } from '../../../../utils/fetch-retry';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Forward the login request to the auth service
    const authApi = process.env.AUTH_API || 'http://localhost:3004';
    const response = await fetch(`${authApi}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    try {
      // Extract the token from the set-cookie header
      const cookieHeader = response.headers.get('set-cookie');
      if (!cookieHeader) {
        return NextResponse.json(
          { error: 'No token found in response' },
          { status: 401 }
        );
      }
      
      // Extract the token from the set-cookie header
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (!tokenMatch) {
        return NextResponse.json(
          { error: 'No token found in response' },
          { status: 401 }
        );
      }
      
      const token = tokenMatch[1];
      return NextResponse.json({ token });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid token format from auth service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 