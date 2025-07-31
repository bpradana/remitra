// Presentation Layer Utilities
// Common utilities and type helpers for the presentation layer

import { BaseApiResponse, WithUserId, WithId } from './common';

// Type-safe response builders
export const createSuccessResponse = <T>(data: T, message = 'Success'): BaseApiResponse<T> => ({
    statusCode: 200,
    message,
    data
});

export const createErrorResponse = (error: string, statusCode = 400): BaseApiResponse<never> => ({
    statusCode,
    message: error,
    error
});

// Common request type builders
export type ApiRequest<T = {}> = T;
export type ApiRequestWithUserId<T = {}> = WithUserId<T>;
export type ApiRequestWithId<T = {}> = WithId<T>;

// Common response type builders
export type ApiResponse<T> = BaseApiResponse<T>;
export type ApiResponseList<T> = BaseApiResponse<T[]>;

// Pagination utilities
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export type PaginatedResponse<T> = BaseApiResponse<PaginatedData<T>>; 