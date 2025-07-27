import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createSignature } from "@/lib/signature";

export async function POST(req: NextRequest, { params }: { params: { userId: string; accountId: string } }) {
    try {
        const { userId, accountId } = params;
        if (!userId || !accountId) {
            return NextResponse.json({ error: 'Missing userId or accountId' }, { status: 400 });
        }

        // Check if user exists
        const user = db.select({
            email: users.email,
            fullname: users.fullName,
            physicalAddress: users.physicalAddress,
            identityNumber: users.identityNumber,
            identityFile: users.identityFile,
        }).from(users).where(eq(users.userId, userId)).get();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if required fields are set
        if (!user.email || !user.fullname || !user.physicalAddress || !user.identityNumber || !user.identityFile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const api_key = process.env.IDRX_API_KEY;
        const api_secret = process.env.IDRX_API_SECRET;
        if (!api_key || !api_secret) {
            return NextResponse.json({ error: 'IDRX API credentials not set' }, { status: 500 });
        }

        // IDRX onboarding
        const baseUrl = process.env.IDRX_API_BASE_URL;
        if (!baseUrl) {
            return NextResponse.json({ error: 'IDRX API base URL is not set' }, { status: 500 });
        }

        // Create FormData for the request
        const form = new FormData();
        form.append("email", user.email);
        form.append("fullname", user.fullname);
        form.append("address", user.physicalAddress);
        form.append("idNumber", user.identityNumber);

        // Convert base64 to Blob for file upload
        const base64Data = user.identityFile;
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        form.append("idFile", blob);

        const method = 'POST';
        const path = `${baseUrl}/api/auth/onboarding`;
        const bufferReq = Buffer.from(JSON.stringify(form), 'base64').toString('utf8');
        const timestamp = Math.round((new Date()).getTime()).toString();
        const signature = createSignature(method, path, bufferReq, timestamp, api_secret);

        // Make the API call
        const response = await fetch(path, {
            method: method,
            body: form,
            headers: {
                'idrx-api-key': api_key,
                'idrx-api-sig': signature,
                'idrx-api-ts': timestamp,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to onboard user' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ error: 'Internal server error during onboarding' }, { status: 500 });
    }
}