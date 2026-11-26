import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
        const response = await fetch(`${bookingApi}/booking/summary?roomid=${roomid}`, {
            headers: {
                'Cookie': `token=${token.value}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch booking summary: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data || {});
    } catch (error) {
        console.error('Error fetching booking summary:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking summary' },
            { status: 500 }
        );
    }
}