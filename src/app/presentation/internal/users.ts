// Internal Users API Schemas
// Internal API for user management

import {
  UserBasicInfo,
  UserProfile,
  CreateUserRequest,
  UpdateProfileRequest,
  BaseApiResponse
} from '@/app/presentation/common';

// API Response types using consistent base patterns
export type GetUserResponse = BaseApiResponse<UserProfile>;
export type CreateUserResponse = BaseApiResponse<UserBasicInfo>;
export type UpdateUserResponse = BaseApiResponse<{ success: boolean }>;

// Request type aliases for clarity
export type GetUserRequest = { userId: string };
export type CreateUserRequestData = CreateUserRequest;
export type UpdateUserRequestData = UpdateProfileRequest; 