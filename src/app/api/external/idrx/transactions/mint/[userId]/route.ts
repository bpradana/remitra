import { NextRequest, NextResponse } from "next/server";
import { createSignature } from "@/lib/signature";
import { users } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { MintResponse } from "@/app/presentation/external/idrx/transactions";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's API credentials from database
    const user = db.select({
      apiKey: users.apiKey,
      apiSecret: users.apiSecret,
    }).from(users).where(eq(users.userId, userId)).get();

    if (!user || !user.apiKey || !user.apiSecret) {
      return NextResponse.json({ error: 'User API credentials not found' }, { status: 404 });
    }

    // Prepare request to IDRX API
    const baseUrl = process.env.IDRX_API_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'IDRX API base URL is not set' }, { status: 500 });
    }

    const method = 'POST';
    const path = `${baseUrl}/api/transaction/mint-request`;

    const body = await req.json();
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Generate signature
    const signature = createSignature(method, path, body, timestamp, user.apiSecret);

    // Make request to IDRX API
    if (!baseUrl) {
      return NextResponse.json({ error: 'IDRX API base URL is not set' }, { status: 500 });
    }
    const response = await fetch(path, {
      method: method,
      headers: {
        'idrx-api-key': user.apiKey,
        'idrx-api-sig': signature,
        'idrx-api-ts': timestamp,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to mint IDRX' }, { status: response.status });
    }

    const data: MintResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to mint IDRX" }, { status: 500 });
  }
}