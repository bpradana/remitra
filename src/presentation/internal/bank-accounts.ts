// Internal Bank Accounts API Schemas
// Internal API for bank account management

import {
    BankAccount,
    CreateBankAccountRequest,
    ApiResponse,
    ErrorResponse,
    SuccessResponse
} from '../common';

// GET /api/internal/users/[userId]/bank-accounts
export interface GetBankAccountsResponse extends ApiResponse<BankAccount[]> { }

// POST /api/internal/users/[userId]/bank-accounts
export interface CreateBankAccountResponse extends ApiResponse<BankAccount> { }

// DELETE /api/internal/users/[userId]/bank-accounts/[accountId]
export interface DeleteBankAccountResponse extends SuccessResponse { }

// Request type aliases for clarity
export type GetBankAccountsRequest = { userId: string };
export type CreateBankAccountRequestData = CreateBankAccountRequest;
export type DeleteBankAccountRequest = {
    userId: string;
    accountId: string;
}; 