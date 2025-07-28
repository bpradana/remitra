import { NextRequest, NextResponse } from "next/server";
import { createSignature } from "@/lib/signature";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.IDRX_API_KEY!;
    const apiSecret = process.env.IDRX_API_SECRET!;
    const timestamp = Date.now().toString();

    const signature = createSignature(
      "POST",
      "https://idrx.co/api/transaction/mint-request",
      body,
      timestamp,
      apiSecret
    );

    const res = await fetch("https://idrx.co/api/transaction/mint-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
        "x-idrx-timestamp": timestamp,
        "x-idrx-signature": signature,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Mint error:", error);
    return NextResponse.json({ error: "Failed to mint IDRX" }, { status: 500 });
  }
}
