"use client";

import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

type UserRole = 'ADMIN' | 'TEACHER' | 'USER';

interface RoleProtectionProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleProtection({ 
  allowedRoles, 
  children, 
  fallback,
  redirectTo
}: RoleProtectionProps) {
  const { user, isLoading } = useAuth();

  // Tampilkan loading saat sedang memuat data user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  // Jika user belum login
  if (!user) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to access this content.</p>
      </div>
    );
  }

  // Cek apakah user memiliki role yang diizinkan
  if (!allowedRoles.includes(user.role as UserRole)) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
                 <p className="text-gray-600 dark:text-gray-400 mt-2">
           You do not have permission to access this content.
         </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Required roles: {allowedRoles.join(', ')} | Your role: {user.role}
        </p>
      </div>
    );
  }

  // Jika user memiliki akses, tampilkan children
  return <>{children}</>;
}

// Hook untuk mengecek role dalam komponen
export function useRoleCheck() {
  const { user } = useAuth();

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  const isAdmin = (): boolean => hasRole(['ADMIN']);
  const isTeacher = (): boolean => hasRole(['TEACHER']);
  const isUser = (): boolean => hasRole(['USER']);
  const isTeacherOrAdmin = (): boolean => hasRole(['TEACHER', 'ADMIN']);

  return {
    user,
    hasRole,
    isAdmin,
    isTeacher,
    isUser,
    isTeacherOrAdmin,
    currentRole: user?.role as UserRole
  };
} 