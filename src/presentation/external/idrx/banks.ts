// IDRX Banks API Schemas
// External API for fetching available banks

import { BankInfo } from '../../common';

export interface IDRXBanksResponse {
    statusCode: number;
    message: string;
    data: BankInfo[];
}

export interface BanksResponse {
    statusCode: number;
    message: string;
    data?: BankInfo[];
    error?: string;
}

// Request schemas (if any specific request parameters are needed)
export interface GetBanksRequest {
    // Currently no specific parameters needed
    // Could be extended with filters, pagination, etc.
} 