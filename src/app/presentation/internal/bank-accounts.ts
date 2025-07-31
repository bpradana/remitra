// Internal Bank Accounts API Schemas
// Internal API for bank account management

import {
    BankAccount,
    CreateBankAccountRequest,
    BaseApiResponse,
    WithUserId
} from '@/app/presentation/common';

// API Response types using consistent base patterns
export type GetBankAccountsResponse = BaseApiResponse<BankAccount[]>;
export type CreateBankAccountResponse = BaseApiResponse<BankAccount>;
export type DeleteBankAccountResponse = BaseApiResponse<{ success: boolean }>;

// Request type aliases for clarity
export type GetBankAccountsRequest = WithUserId;
export type CreateBankAccountRequestData = CreateBankAccountRequest;
export type DeleteBankAccountRequest = WithUserId<{ accountId: string }>; 