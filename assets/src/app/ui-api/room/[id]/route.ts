import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithRetry as fetch } from '../../../../utils/fetch-retry';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
try {
    const { id } = await params;
    const roomApi = process.env.ROOM_API || 'http://localhost:3001';
    
    const response = await fetch(`${roomApi}/room/${id}`);
    
    if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
        errorData,
        { status: response.status }
        );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json([], { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const roomApi = process.env.ROOM_API || 'http://localhost:3001';
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        
        if (!token) {
            return NextResponse.json(
                { errors: ['Authentication required'] },
                { status: 401 }
            );
        }
        
        const response = await fetch(`${roomApi}/room/${id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': `token=${token.value}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { errors: errorData.errors || ['Failed to delete room'] },
                { status: response.status }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json(
        { errors: ['An unexpected error occurred'] },
        { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
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
        
        const response = await fetch(`${roomApi}/room/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token.value}`
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { errors: errorData.fieldErrors || ['Failed to update room'] },
                { status: response.status }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating room:', error);
        return NextResponse.json(
        { errors: ['An unexpected error occurred'] },
        { status: 500 }
        );
    }
}