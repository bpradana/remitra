// IDRX Onboarding API Schemas
// External API for user onboarding process

export interface IDRXUserData {
    id: number;
    fullname: string;
    createdAt: string;
    apiKey: string;
    apiSecret: string;
}

export interface IDRXOnboardingResponse {
    statusCode: number;
    message: string;
    data: IDRXUserData;
}

export interface OnboardingRequest {
    email: string;
    fullname: string;
    address: string;
    idNumber: string;
    idFile: File | Blob;
}

export interface OnboardingResponse {
    statusCode: number;
    message: string;
    data?: IDRXUserData;
    error?: string;
} 