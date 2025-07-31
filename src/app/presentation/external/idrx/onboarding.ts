// IDRX Onboarding API Schemas
// External API for user onboarding process

import { BaseApiResponse } from '@/app/presentation/common';

export interface IDRXUserData {
    id: number;
    fullname: string;
    createdAt: string;
    apiKey: string;
    apiSecret: string;
}

// Use consistent base response pattern
export type OnboardingResponse = BaseApiResponse<IDRXUserData>;

export interface OnboardingRequest {
    email: string;
    fullname: string;
    address: string;
    idNumber: string;
    idFile: File | Blob;
} 