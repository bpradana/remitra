import { NextRequest, NextResponse } from "next/server";
import { createSignature } from "@/lib/signature";
import { RatesResponse } from "@/app/presentation/external/idrx/transactions";

export async function GET(req: NextRequest) {
	try {
		const apiKey = process.env.IDRX_API_KEY;
		const apiSecret = process.env.IDRX_API_SECRET;
		if (!apiKey || !apiSecret) {
			return NextResponse.json({ error: 'IDRX API credentials not set' }, { status: 500 });
		}

		// Prepare request to IDRX API
		const baseUrl = process.env.IDRX_API_BASE_URL;
		if (!baseUrl) {
			return NextResponse.json({ error: 'IDRX API base URL is not set' }, { status: 500 });
		}

		const method = 'GET';
		const path = `${baseUrl}/api/transaction/rates`;
		const body = {};
		const timestamp = Math.floor(Date.now() / 1000).toString();

		// Generate signature
		const signature = createSignature(method, path, body, timestamp, apiSecret);

		// Make request to IDRX API
		if (!baseUrl) {
			return NextResponse.json({ error: 'IDRX API base URL is not set' }, { status: 500 });
		}
		const response = await fetch(path, {
			method: method,
			headers: {
				'idrx-api-key': apiKey,
				'idrx-api-sig': signature,
				'idrx-api-ts': timestamp,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			return NextResponse.json({ error: 'Failed to fetch banks from IDRX API' }, { status: response.status });
		}
		const data: RatesResponse = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 