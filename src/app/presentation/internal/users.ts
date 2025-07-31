// Internal Users API Schemas
// Internal API for user management

import {
  UserBasicInfo,
  UserProfile,
  CreateUserRequest,
  UpdateProfileRequest,
  ApiResponse,
  ErrorResponse,
  SuccessResponse
} from '../common';

// GET /api/internal/users/[userId]
export interface GetUserResponse extends ApiResponse<UserProfile> { }

// POST /api/internal/users
export interface CreateUserResponse extends SuccessResponse {
  message?: string;
}

// PATCH /api/internal/users/[userId]
export interface UpdateUserResponse extends SuccessResponse { }

// Request/Response type aliases for clarity
export type GetUserRequest = { userId: string };
export type CreateUserRequestData = CreateUserRequest;
export type UpdateUserRequestData = UpdateProfileRequest; 