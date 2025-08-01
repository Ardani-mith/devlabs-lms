"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Import the main course management component from manage-course
import APIIntegratedCourseManagement from '@/app/manage-course/page-api-integrated';

/**
 * Course Management Page
 * Route: /courses/manage
 * 
 * This page provides a clean URL structure while using the 
 * full-featured course management implementation
 */
export default function CoursesManagePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Role-based access control
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only teachers and admins can access course management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Use the existing full-featured course management */}
      <APIIntegratedCourseManagement />
    </div>
  );
}
