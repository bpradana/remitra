import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    try {
        const user = db.select().from(users).where(eq(users.userId, userId)).get();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            userId: user.userId,
            email: user.email,
            address: user.address,
            userName: user.userName,
        });
    } catch (err) {
        return NextResponse.json({ error: `Failed to fetch user info: ${err}` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const { userName } = await req.json();
    if (!userName) {
        return NextResponse.json({ error: 'Missing userName' }, { status: 400 });
    }
    try {
        db.update(users).set({ userName }).where(eq(users.userId, userId)).run();
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: `Failed to update user info: ${err}` }, { status: 500 });
    }
}