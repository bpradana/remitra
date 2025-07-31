// IDRX Banks API Schemas
// External API for fetching available banks

import { BankInfo, BaseApiResponse } from '@/app/presentation/common';

// Use consistent base response pattern
export type BanksResponse = BaseApiResponse<BankInfo[]>;

// Request schemas (if any specific request parameters are needed)
export interface GetBanksRequest {
    // Currently no specific parameters needed
    // Could be extended with filters, pagination, etc.
} 