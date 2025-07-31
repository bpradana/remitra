import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { GetUserResponse, UpdateUserResponse, UpdateUserRequestData } from '@/app/presentation/internal/users';
import { createSuccessResponse, createErrorResponse } from '@/app/presentation/utils';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json(createErrorResponse('Missing userId', 400), { status: 400 });
    }
    try {
        const user = db.select().from(users).where(eq(users.userId, userId)).get();
        if (!user) {
            return NextResponse.json(createErrorResponse('User not found', 404), { status: 404 });
        }
        const userData = {
            userId: user.userId,
            email: user.email,
            address: user.walletAddress,
            fullName: user.fullName,
            physicalAddress: user.physicalAddress,
            userName: user.userName,
            identityNumber: user.identityNumber,
            identityFile: user.identityFile,
            isVerified: user.isVerified,
        };
        return NextResponse.json(createSuccessResponse(userData));
    } catch (err) {
        return NextResponse.json(createErrorResponse(`Failed to fetch user info: ${err}`, 500), { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    if (!userId) {
        return NextResponse.json(createErrorResponse('Missing userId', 400), { status: 400 });
    }

    const updateData: UpdateUserRequestData = await req.json();
    const { userName, email, identityNumber, fullName, physicalAddress, identityFile } = updateData;

    // Build update object with only provided fields
    const updateFields: any = {};
    if (userName !== undefined) updateFields.userName = userName;
    if (email !== undefined) updateFields.email = email;
    if (identityNumber !== undefined) updateFields.identityNumber = identityNumber;
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (physicalAddress !== undefined) updateFields.physicalAddress = physicalAddress;
    if (identityFile !== undefined) updateFields.identityFile = identityFile;

    // Check if at least one field is provided
    if (Object.keys(updateFields).length === 0) {
        return NextResponse.json(createErrorResponse('No fields provided for update', 400), { status: 400 });
    }

    try {
        db.update(users).set(updateFields).where(eq(users.userId, userId)).run();
        return NextResponse.json(createSuccessResponse({ success: true }));
    } catch (err) {
        return NextResponse.json(createErrorResponse(`Failed to update user info: ${err}`, 500), { status: 500 });
    }
}