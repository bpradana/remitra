// IDRX Transactions API Schemas
// External API for transaction operations (mint, fees, rates)

import { TransactionData, BaseApiResponse } from '@/app/presentation/common';

// Use consistent base response patterns
export type MintResponse = BaseApiResponse<TransactionData>;

export interface MintRequest {
    amount: string;
    merchantOrderId: string;
    reference: string;
    // Add other required fields as needed based on IDRX API documentation
}

// Fees API schemas
export interface FeesData {
    id: number;
    name: string;
    amount: number;
    isActive: boolean;
    deleted: boolean;
}

export type FeesResponse = BaseApiResponse<FeesData[]>;

// Rates API schemas
export interface RatesData {
    price: number;
    buyAmount: number;
    chainId: number;
}

export type RatesResponse = BaseApiResponse<RatesData[]>; 