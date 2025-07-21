import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { userId, email, address } = await req.json();
    if (!userId || !email || !address) {
        return NextResponse.json({ error: 'Missing email or address' }, { status: 400 });
    }
    try {
        const existing = db.select().from(users).where(eq(users.userId, userId)).get();
        if (existing) {
            return NextResponse.json({ success: true, message: 'User already exists' });
        }
        db.insert(users).values({ userId, email, address }).run();
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: `Failed to save user info: ${err}` }, { status: 500 });
    }
}