"use client";

import React from 'react';
import { RoleProtection, useRoleCheck } from '@/components/shared';
import { 
  ShieldCheckIcon, 
  AcademicCapIcon, 
  UserIcon, 
  BookOpenIcon,
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

export default function RolesDemoPage() {
  const { user, isAdmin, isTeacher, currentRole } = useRoleCheck();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎭 Role-Based Access Control Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Demonstrasi sistem role ADMIN, TEACHER, dan USER
          </p>
          {user && (
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              <UserIcon className="h-5 w-5 mr-2" />
              Logged in as: <strong className="ml-1">{user.name || user.username}</strong> 
              <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200">
                {currentRole}
              </span>
            </div>
          )}
        </div>

        {/* Role Sections Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* ADMIN Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center text-white">
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">ADMIN Access</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Konten khusus untuk Administrator
              </p>
              
              <RoleProtection allowedRoles={['ADMIN']}>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 dark:text-red-200">Platform Analytics</span>
                  </div>
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <CogIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 dark:text-red-200">System Settings</span>
                  </div>
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <UserIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 dark:text-red-200">User Management</span>
                  </div>
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-200 font-semibold">✅ Admin Features Active</p>
                    <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                      You have full administrative access
                    </p>
                  </div>
                </div>
              </RoleProtection>
            </div>
          </div>

          {/* TEACHER Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center text-white">
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">TEACHER Access</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Konten khusus untuk Pengajar
              </p>
              
              <RoleProtection allowedRoles={['TEACHER', 'ADMIN']}>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 dark:text-blue-200">Course Management</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 dark:text-blue-200">Student Management</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 dark:text-blue-200">Teaching Analytics</span>
                  </div>
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-200 font-semibold">✅ Teacher Features Active</p>
                    <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                      You can manage courses and students
                    </p>
                  </div>
                </div>
              </RoleProtection>
            </div>
          </div>

          {/* USER Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center text-white">
                <UserIcon className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">USER Access</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Konten untuk semua pengguna
              </p>
              
              <RoleProtection allowedRoles={['USER', 'TEACHER', 'ADMIN']}>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 dark:text-green-200">View Courses</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <UserIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 dark:text-green-200">Profile Management</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 dark:text-green-200">Learning Progress</span>
                  </div>
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-200 font-semibold">✅ Basic Features Active</p>
                    <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                      You can access student features
                    </p>
                  </div>
                </div>
              </RoleProtection>
            </div>
          </div>
        </div>

        {/* Role Status Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className={`p-6 rounded-xl ${isAdmin() ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500' : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'}`}>
            <h3 className={`text-lg font-semibold ${isAdmin() ? 'text-red-800 dark:text-red-200' : 'text-gray-600 dark:text-gray-400'}`}>
              Admin Status
            </h3>
            <p className={`text-sm mt-2 ${isAdmin() ? 'text-red-600 dark:text-red-300' : 'text-gray-500 dark:text-gray-500'}`}>
              {isAdmin() ? '✅ You have admin privileges' : '❌ Admin access required'}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${isTeacher() || isAdmin() ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'}`}>
            <h3 className={`text-lg font-semibold ${isTeacher() || isAdmin() ? 'text-blue-800 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}>
              Teacher Status
            </h3>
            <p className={`text-sm mt-2 ${isTeacher() || isAdmin() ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-500'}`}>
              {isTeacher() || isAdmin() ? '✅ You can teach and manage courses' : '❌ Teacher access required'}
            </p>
          </div>

          <div className={`p-6 rounded-xl ${user ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'}`}>
            <h3 className={`text-lg font-semibold ${user ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'}`}>
              User Status
            </h3>
            <p className={`text-sm mt-2 ${user ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-500'}`}>
              {user ? '✅ You can access student features' : '❌ Please log in'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Sistem Role Frontend LMS
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Fitur yang Diimplementasi:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>✅ <strong>AuthContext</strong> dengan role ADMIN, TEACHER, USER</li>
                <li>✅ <strong>RoleProtection</strong> component untuk akses kontrol</li>
                <li>✅ <strong>useRoleCheck</strong> hook untuk cek role di komponen</li>
                <li>✅ <strong>Sidebar navigation</strong> yang adaptive berdasarkan role</li>
                <li>✅ <strong>Dashboard content</strong> yang berbeda per role</li>
                <li>✅ <strong>Teachers page</strong> dengan course management untuk TEACHER</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Cara Kerja:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>🔐 <strong>ADMIN</strong>: Akses penuh ke semua fitur platform</li>
                <li>📚 <strong>TEACHER</strong>: Dapat mengelola kursus dan siswa</li>
                <li>👨‍🎓 <strong>USER</strong>: Akses ke fitur pembelajaran dan profil</li>
                <li>🛡️ <strong>Role-based navigation</strong> di sidebar otomatis</li>
                <li>⚡ <strong>Real-time</strong> role detection dan UI adaptation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 