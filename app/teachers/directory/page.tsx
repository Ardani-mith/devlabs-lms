"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ✅ Redirect to /teachers for consistency - this page is now deprecated
export default function TeacherDirectoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main teachers page which handles both role-based logic and public directory
    router.push('/teachers');
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to Teachers page...</p>
      </div>
    </div>
  );
} 