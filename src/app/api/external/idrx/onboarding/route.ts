import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string; accountId: string } }) {
    const { userId, accountId } = params;
    if (!userId || !accountId) {
        return NextResponse.json({ error: 'Missing userId or accountId' }, { status: 400 });
    }
    // Check if user exists
    const user = db.select().from(users).where(eq(users.userId, userId)).get();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { email, fullname, address, idNumber, idFile } = await req.json();
    if (!email || !fullname || !address || !idNumber || !idFile) {
        return NextResponse.json({ error: 'Missing email or fullname or address or idNumber or idFile' }, { status: 400 });
    }

    const idFileUrl = await uploadFile(idFile);
}