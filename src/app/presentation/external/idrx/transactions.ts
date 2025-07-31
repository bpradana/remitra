// IDRX Transactions API Schemas
// External API for transaction operations (mint, fees, rates)

import { TransactionData } from '../../common';

export interface IDRXMintResponse {
    statusCode: number;
    message: string;
    data: TransactionData;
}

export interface MintRequest {
    // Add specific mint request parameters based on IDRX API documentation
    // This is a placeholder - actual parameters should match IDRX API spec
    amount: string;
    merchantOrderId: string;
    reference: string;
    // Add other required fields as needed
}

export interface MintResponse {
    statusCode: number;
    message: string;
    data?: TransactionData;
    error?: string;
}

// Fees API schemas (for future implementation)
export interface FeesRequest {
    // Add specific fees request parameters
}

export interface FeesResponse {
    statusCode: number;
    message: string;
    data?: any;
    error?: string;
}

// Rates API schemas (for future implementation)
export interface RatesRequest {
    // Add specific rates request parameters
}

export interface RatesResponse {
    statusCode: number;
    message: string;
    data?: any;
    error?: string;
} 