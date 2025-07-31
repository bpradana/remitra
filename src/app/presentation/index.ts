// Presentation Layer Index
// Central export point for all presentation layer types and utilities

// Common types and utilities
export * from './common';
export {
    createSuccessResponse,
    createErrorResponse
} from './utils';
export type {
    ApiRequest,
    ApiRequestWithUserId,
    ApiRequestWithId,
    ApiResponse,
    ApiResponseList,
    PaginationParams,
    PaginatedData,
    PaginatedResponse
} from './utils';

// Internal API schemas
export * from './internal/users';
export * from './internal/bank-accounts';

// External API schemas
export * from './external/idrx/banks';
export * from './external/idrx/onboarding';
export * from './external/idrx/transactions'; 