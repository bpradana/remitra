import { db } from '@/db';
import { bankAccounts, banks, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { GetBankAccountsResponse, CreateBankAccountResponse, CreateBankAccountRequestData } from '@/app/presentation/internal/bank-accounts';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    // Check if user exists
    const user = db.select().from(users).where(eq(users.userId, userId)).get();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

        return NextResponse.json(userBankAccounts as GetBankAccountsResponse);
    } catch (err) {
        return NextResponse.json({ error: `Failed to fetch bank accounts: ${err}` }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { bankCode, bankName, accountNumber }: CreateBankAccountRequestData = await req.json();
    if (!bankCode || !bankName || !accountNumber) {
        return NextResponse.json({ error: 'Missing bankCode or bankName or accountNumber' }, { status: 400 });
    }

    try {
        // Check if user exists
        const user = db.select().from(users).where(eq(users.userId, userId)).get();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
            return NextResponse.json({ error: 'Bank account already exists' }, { status: 409 });
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

        return NextResponse.json({
            id: newBankAccount.id,
            bankName,
            accountNumber: newBankAccount.accountNumber,
            createdAt: newBankAccount.createdAt,
        } as CreateBankAccountResponse);
    } catch (err) {
        return NextResponse.json({ error: `Failed to create bank account: ${err}` }, { status: 500 });
    }
} 