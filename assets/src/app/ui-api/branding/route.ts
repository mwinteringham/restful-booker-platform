import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../utils/fetch-retry';

export const dynamic = 'force-dynamic'

// Server-side API route that proxies requests to the branding service
export async function GET() {
  try {
    const brandingApi = process.env.BRANDING_API || 'http://localhost:3002';
    const response = await fetch(`${brandingApi}/branding/`, {
      next: { 
        revalidate: 60,  // Cache for 60 seconds
        tags: ['branding'] // Add a cache tag
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch branding: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching branding:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branding' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const brandingApi = process.env.BRANDING_API || 'http://localhost:3002';
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
    
    const response = await fetch(`${brandingApi}/branding/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 202) {
      const errorData = await response.json();
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating branding:', error);
    return NextResponse.json(
      { errors: ['An unexpected error occurred'] },
      { status: 500 }
    );
  }
} 