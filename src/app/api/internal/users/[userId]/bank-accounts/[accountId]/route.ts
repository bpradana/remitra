import { db } from '@/db';
import { bankAccounts, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '@/app/presentation/utils';

export async function DELETE(req: NextRequest, { params }: { params: { userId: string; accountId: string } }) {
    const { userId, accountId } = params;
    if (!userId || !accountId) {
        return NextResponse.json({ error: 'Missing userId or accountId' }, { status: 400 });
    }
    // Check if user exists
    const user = db.select().from(users).where(eq(users.userId, userId)).get();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    try {
        const result = db
            .delete(bankAccounts)
            .where(and(
                eq(bankAccounts.id, parseInt(accountId)),
                eq(bankAccounts.userId, user.id)
            ))
            .returning()
            .get();

        if (!result) {
            return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
        }

        return NextResponse.json(createSuccessResponse({ success: true }));
    } catch (err) {
        return NextResponse.json({ error: `Failed to delete bank account: ${err}` }, { status: 500 });
    }
} 