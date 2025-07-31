import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createSignature } from "@/lib/signature";
import { IDRXOnboardingResponse } from "@/app/presentation/external/idrx/onboarding";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
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
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    form.append("idFile", blob);

    const method = 'POST';
    const path = `${baseUrl}/api/auth/onboarding`;

    // Create a simple object for signature calculation
    const signatureData = {
      email: user.email,
      fullname: user.fullname,
      address: user.physicalAddress,
      idNumber: user.identityNumber,
    };
    const bufferReq = Buffer.from(JSON.stringify(signatureData), 'utf8').toString('base64');
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

    const data: IDRXOnboardingResponse = await response.json();

    // Update user with IDRX API credentials
    await db.update(users).set({
      apiKey: data.data.apiKey,
      apiSecret: data.data.apiSecret,
      isVerified: true,
    }).where(eq(users.userId, userId));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error during onboarding' }, { status: 500 });
  }
}