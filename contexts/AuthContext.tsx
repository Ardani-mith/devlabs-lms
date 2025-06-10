// ====================================================================
// FILE 1 (UPDATED): contexts/AuthContext.tsx
// Lokasi: contexts/AuthContext.tsx
// ====================================================================

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Interface User yang lebih lengkap ---
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'USER' | string;
  name?: string;
  avatarUrl?: string; // Pastikan ini ada
  bio?: string;       // Pastikan ini ada
  department?: string;// Pastikan ini ada
  // Tambahkan properti lain yang mungkin dikembalikan oleh backend
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string) => Promise<void>; // Fungsi ini akan set token & fetch user profile
  logout: () => void;
  isLoading: boolean;
  updateUserContext: (newUserData: Partial<User>) => void; // Fungsi untuk update state user secara optimistik
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading true saat aplikasi pertama kali dimuat
  const [mounted, setMounted] = useState(false);

  // Fungsi terpusat untuk mengambil profil pengguna dari backend
  const fetchUserProfile = async (accessToken: string) => {
    // Jangan set loading true di sini jika dipanggil dari login (sudah dihandle)
    // setIsloading(true) akan menyebabkan flicker saat refresh data setelah update profil.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, { // Gunakan endpoint /auth/profile atau /users/profile/me
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil profil pengguna atau token tidak valid.');
      }

      const userDataFromApi = await response.json();
      
      const mappedUser: User = {
        id: userDataFromApi.Id || userDataFromApi.sub,
        username: userDataFromApi.username,
        email: userDataFromApi.email,
        role: userDataFromApi.role,
        name: userDataFromApi.name || userDataFromApi.username,
        avatarUrl: userDataFromApi.avatarUrl,
        bio: userDataFromApi.bio,
        department: userDataFromApi.department,
      };

      setUser(mappedUser);
      setToken(accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem('accessToken', accessToken);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout(); // Logout jika token tidak valid
    } finally {
      setIsLoading(false); // Selalu set loading false setelah selesai
    }
  };
  
  // Efek ini berjalan sekali saat komponen pertama kali dimuat
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          fetchUserProfile(storedToken);
        } else {
          setIsLoading(false);
        }
    } else {
        setIsLoading(false); 
    }
  }, []);


  const login = async (accessToken: string) => {
    // Fungsi login sekarang hanya memicu fetchUserProfile
    await fetchUserProfile(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login'; // Redirect paksa ke halaman login
    }
  };

  // Fungsi untuk update user di context secara optimistik
  const updateUserContext = (newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        console.log("Updating user context optimistically:", { ...prevUser, ...newUserData });
        return { ...prevUser, ...newUserData };
      }
      return null;
    });
  };

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, token: null, login, logout, isLoading: true, updateUserContext }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUserContext }}>
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