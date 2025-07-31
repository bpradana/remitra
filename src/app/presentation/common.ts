// Common/Shared Schemas
// These are used across multiple API endpoints and hooks

// Base response types for consistent API responses
export interface BaseApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
}

export interface ErrorResponse {
    error: string;
    statusCode?: number;
}

export interface SuccessResponse {
    success: boolean;
    message?: string;
}

// Common user-related types
export interface UserBasicInfo {
    userId: string;
    email: string;
    address: string;
}

export interface UserProfile {
    userId: string;
    email: string;
    address: string;
    fullName?: string;
    physicalAddress?: string;
    userName?: string;
    identityNumber?: string;
    identityFile?: string;
    isVerified?: boolean;
}

// Common bank-related types
export interface BankInfo {
    bankCode: string;
    bankName: string;
    maxAmountTransfer: string;
}

export interface BankAccount {
    id: number;
    bankName: string;
    accountNumber: string;
    createdAt: string;
}

// Common transaction types
export interface TransactionData {
    id: string;
    merchantCode: string;
    reference: string;
    paymentUrl: string;
    amount: string;
    statusCode: string;
    statusMessage: string;
    merchantOrderId: string;
}

// Common API request types
export interface CreateUserRequest {
    userId: string;
    email: string;
    address: string;
}

export interface UpdateProfileRequest {
    userName?: string;
    email?: string;
    identityNumber?: string;
    fullName?: string;
    physicalAddress?: string;
    identityFile?: string;
}

export interface CreateBankAccountRequest {
    bankCode: string;
    bankName: string;
    accountNumber: string;
}

// Utility types for common patterns
export type WithUserId<T = {}> = T & { userId: string };
export type WithId<T = {}> = T & { id: string }; 