/**
 * Authentication React Hooks
 */

import { useState, useCallback } from 'react';
import { authEndpoints } from '../endpoints/auth';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types';
import type { User } from '@/lib/types';

// ====================================================================
// Login Hook
// ====================================================================

interface UseLoginReturn {
  login: (credentials: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authEndpoints.login(credentials);
      
      // Store token in localStorage and API client
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // You can dispatch to your auth context here
      // authContext.setUser(response.user);
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
}

// ====================================================================
// Register Hook
// ====================================================================

interface UseRegisterReturn {
  register: (userData: RegisterRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authEndpoints.register(userData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register, isLoading, error };
}

// ====================================================================
// Profile Hook
// ====================================================================

interface UseProfileReturn {
  profile: User | null;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userProfile = await authEndpoints.getProfile();
      setProfile(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await authEndpoints.updateProfile(data);
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { profile, updateProfile, refreshProfile, isLoading, error };
}

// ====================================================================
// Logout Hook
// ====================================================================

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
}

export function useLogout(): UseLogoutReturn {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authEndpoints.logout();
    } catch (err) {
      // Continue with local logout even if server logout fails
      console.warn('Server logout failed:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // You can dispatch to your auth context here
      // authContext.clearUser();
      
      setIsLoading(false);
    }
  }, []);

  return { logout, isLoading };
}

// ====================================================================
// Password Reset Hook
// ====================================================================

interface UsePasswordResetReturn {
  requestReset: (email: string) => Promise<void>;
  confirmReset: (token: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function usePasswordReset(): UsePasswordResetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authEndpoints.requestPasswordReset(email);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmReset = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authEndpoints.resetPassword(token, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { requestReset, confirmReset, isLoading, error };
}
