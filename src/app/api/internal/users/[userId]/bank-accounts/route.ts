import { db } from '@/db';
import { bankAccounts, banks, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBankAccountRequestData } from '@/app/presentation/internal/bank-accounts';
import { createSuccessResponse, createErrorResponse } from '@/app/presentation/utils';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json(createErrorResponse('Missing userId', 400), { status: 400 });
    }
    // Check if user exists
    const user = db.select().from(users).where(eq(users.userId, userId)).get();
    if (!user) {
        return NextResponse.json(createErrorResponse('User not found', 404), { status: 404 });
    }
    try {
        const userBankAccounts = db
            .select({
                id: bankAccounts.id,
                bankName: banks.name,
                accountNumber: bankAccounts.accountNumber,
                createdAt: bankAccounts.createdAt,
            })
            .from(bankAccounts)
            .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
            .where(eq(bankAccounts.userId, user.id))
            .all();

        return NextResponse.json(createSuccessResponse(userBankAccounts));
    } catch (err) {
        return NextResponse.json(createErrorResponse(`Failed to fetch bank accounts: ${err}`, 500), { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json(createErrorResponse('Missing userId', 400), { status: 400 });
    }

    const { bankCode, bankName, accountNumber }: CreateBankAccountRequestData = await req.json();
    if (!bankCode || !bankName || !accountNumber) {
        return NextResponse.json(createErrorResponse('Missing bankCode or bankName or accountNumber', 400), { status: 400 });
    }

    try {
        // Check if user exists
        const user = db.select().from(users).where(eq(users.userId, userId)).get();
        if (!user) {
            return NextResponse.json(createErrorResponse('User not found', 404), { status: 404 });
        }

        // First, get or create the bank
        let bank = db.select().from(banks).where(eq(banks.code, bankCode)).get();
        if (!bank) {
            const result = db.insert(banks).values({ code: bankCode, name: bankName }).returning().get();
            bank = result;
        }

        // Check if this bank account already exists for this user
        const existingAccount = db
            .select()
            .from(bankAccounts)
            .where(and(
                eq(bankAccounts.userId, user.id),
                eq(bankAccounts.bankId, bank.id),
                eq(bankAccounts.accountNumber, accountNumber)
            ))
            .get();

        if (existingAccount) {
            return NextResponse.json(createErrorResponse('Bank account already exists', 409), { status: 409 });
        }

        // Create the bank account
        const newBankAccount = db
            .insert(bankAccounts)
            .values({
                userId: user.id,
                bankId: bank.id,
                accountNumber,
            })
            .returning()
            .get();

        const bankAccountData = {
            id: newBankAccount.id,
            bankName,
            accountNumber: newBankAccount.accountNumber,
            createdAt: newBankAccount.createdAt,
        };
        return NextResponse.json(createSuccessResponse(bankAccountData));
    } catch (err) {
        return NextResponse.json(createErrorResponse(`Failed to create bank account: ${err}`, 500), { status: 500 });
    }
} 