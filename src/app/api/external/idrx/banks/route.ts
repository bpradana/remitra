import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSignature } from '@/lib/signature';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get user's API credentials from database
        const user = await db.select({
            apiKey: users.apiKey,
            apiSecret: users.apiSecret,
        }).from(users).where(eq(users.userId, userId)).get();

        if (!user || !user.apiKey || !user.apiSecret) {
            return NextResponse.json({ error: 'User API credentials not found' }, { status: 404 });
        }

        // Prepare request to IDRX API
        const method = 'GET';
        const url = '/api/transaction/method';
        const body = {};
        const timestamp = Math.floor(Date.now() / 1000).toString();

        // Generate signature
        const signature = createSignature(method, url, body, timestamp, user.apiSecret);

        // Make request to IDRX API
        const response = await fetch('https://idrx.co/api/transaction/method', {
            method: 'GET',
            headers: {
                'idrx-api-key': user.apiKey,
                'idrx-api-sig': signature,
                'idrx-api-ts': timestamp,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('IDRX API error:', errorText);
            return NextResponse.json({ error: 'Failed to fetch banks from IDRX API' }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching banks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 