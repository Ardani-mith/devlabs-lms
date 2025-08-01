/**
 * Authentication API Endpoints
 */

import { api } from '../client';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  UpdateProfileRequest
} from '../types';
import type { User } from '@/lib/types';

export const authEndpoints = {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * User registration
   */
  async register(userData: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/profile/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.patch<User>('/users/profile/me', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ access_token: string }> {
    const response = await api.post<{ access_token: string }>('/auth/refresh');
    return response.data;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset/confirm', {
      token,
      newPassword
    });
    return response.data;
  },

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/resend-verification');
    return response.data;
  }
};

export default authEndpoints;
