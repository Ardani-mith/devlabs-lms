// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import jwt_decode from 'jwt-decode'; // Jika Anda ingin decode token di frontend

interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'USER' | string; // Gunakan tipe Role dari Prisma jika memungkinkan
  name?: string;
  // tambahkan properti lain yang relevan
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string) => Promise<void>; // Modifikasi untuk mengambil info user
  logout: () => void;
  isLoading: boolean; // Untuk menangani loading state saat fetch user info
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading true

  useEffect(() => {
    // Coba ambil token dari localStorage saat aplikasi pertama kali dimuat
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (accessToken: string) => {
    setIsLoading(true);
    try {
      // Panggil endpoint backend untuk mendapatkan profil pengguna
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil profil pengguna');
      }
      const userDataFromApi = await response.json();
      // Pastikan userDataFromApi memiliki struktur yang sesuai dengan interface User
      // Misalnya, backend mengembalikan { userId, username, email, role }
      // dan Anda perlu memetakannya ke interface User Anda.
      // Contoh:
      const mappedUser: User = {
        id: userDataFromApi.userId || userDataFromApi.sub, // Sesuaikan dengan respons backend
        username: userDataFromApi.username,
        email: userDataFromApi.email,
        role: userDataFromApi.role,
        name: userDataFromApi.name || userDataFromApi.username, // Ambil nama jika ada
      };
      setUser(mappedUser);
      setToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout(); // Logout jika token tidak valid atau ada error
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string) => {
    await fetchUserProfile(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    // Redirect ke halaman login
    // Anda mungkin perlu menggunakan router di sini jika ini bukan bagian dari layout utama
    // window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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