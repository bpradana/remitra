import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { CreateUserRequestData } from '@/app/presentation/internal/users';
import { createSuccessResponse, createErrorResponse } from '@/app/presentation/utils';

export async function POST(req: NextRequest) {
    const { userId, email, address }: CreateUserRequestData = await req.json();
    if (!userId || !email || !address) {
        return NextResponse.json({ error: 'Missing email or address' }, { status: 400 });
    }
    try {
        const existing = db.select().from(users).where(eq(users.userId, userId)).get();
        if (existing) {
            return NextResponse.json(createErrorResponse('User already exists', 400), { status: 400 });
        }
        db.insert(users).values({ userId, email, walletAddress: address }).run();
        return NextResponse.json(createSuccessResponse({ success: true }));
    } catch (err) {
        return NextResponse.json({ error: `Failed to save user info: ${err}` }, { status: 500 });
    }
}