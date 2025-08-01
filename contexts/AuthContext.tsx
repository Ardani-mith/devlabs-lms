"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI, ApiError } from '@/lib/services/apiService';

// Definisikan interface User agar konsisten
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'USER' | string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean; // Status loading untuk inisialisasi awal
  updateUserContext: (newUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fungsi terpusat untuk mengambil profil pengguna dari backend
  const fetchUserProfile = async (accessToken: string) => {
    try {
      const data = await AuthAPI.getProfile(accessToken);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('👤 User profile fetched:', data);
      }
      
      const mappedUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        name: data.name || data.username,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        department: data.department,
      };

      setUser(mappedUser);
      setToken(accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem('accessToken', accessToken);
      }
    } catch (error) {
      console.error("Gagal memvalidasi sesi:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efek ini berjalan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
    if (storedToken) {
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false); // Tidak ada token, selesai loading
    }
  }, []);

  // Method untuk login dengan token langsung (digunakan setelah berhasil login)
  const login = async (accessToken: string): Promise<void> => {
    await fetchUserProfile(accessToken);
  };

  // Method untuk login dengan credentials
  const loginWithCredentials = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const data = await AuthAPI.login(username, password);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Login successful:', { username, token: data.access_token?.substring(0, 20) + '...' });
      }
      
      if (data.access_token) {
        await fetchUserProfile(data.access_token);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: "Token tidak ditemukan dalam response" 
      };

    } catch (error) {
      console.error("Login error:", error);
      const apiError = error as ApiError;
      return { 
        success: false, 
        error: apiError.message || "Terjadi kesalahan saat menghubungi server" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem('accessToken');
    }
    router.push('/'); // Gunakan router untuk redirect yang lebih baik
  };

  // Fungsi untuk update user di context secara optimistik
  const updateUserContext = (newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        return { ...prevUser, ...newUserData };
      }
      return null;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithCredentials, logout, isLoading, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};