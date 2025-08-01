/**
 * Test Control Panel for Development
 * Provides UI controls to test different enrollment states
 */

"use client";

import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  UserPlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  PlayIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { 
  getTestEnrollmentData, 
  simulateEnrollment, 
  simulateLessonComplete, 
  resetEnrollment,
  type TestEnrollmentData 
} from '@/lib/utils/testEnrollment';

interface TestControlPanelProps {
  courseSlug: string;
  onEnrollmentChange?: (data: TestEnrollmentData) => void;
}

export default function TestControlPanel({ courseSlug, onEnrollmentChange }: TestControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<TestEnrollmentData>();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    const updateEnrollmentData = () => {
      const data = getTestEnrollmentData(courseSlug);
      setEnrollmentData(data);
      onEnrollmentChange?.(data);
    };

    updateEnrollmentData();

    // Listen for enrollment changes
    const handleEnrollmentChange = (event: CustomEvent) => {
      if (event.detail.courseSlug === courseSlug) {
        updateEnrollmentData();
      }
    };

    window.addEventListener('enrollmentChanged', handleEnrollmentChange as EventListener);
    return () => {
      window.removeEventListener('enrollmentChanged', handleEnrollmentChange as EventListener);
    };
  }, [courseSlug]); // Remove onEnrollmentChange from dependency

  const handleEnroll = () => {
    simulateEnrollment(courseSlug);
  };

  const handleReset = () => {
    resetEnrollment(courseSlug);
  };

  const handleLessonComplete = (lessonId: string, lessonTitle: string) => {
    simulateLessonComplete(courseSlug, lessonId, lessonTitle);
  };

  const mockLessons = [
    { id: '1', title: 'Pengenalan Course' },
    { id: '2', title: 'Dasar-dasar Materi' },
    { id: '3', title: 'Praktik Langsung' },
    { id: '4', title: 'Studi Kasus' },
    { id: '5', title: 'Kesimpulan' },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title="Open Test Controls"
        >
          <CogIcon className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <CogIcon className="h-5 w-5 mr-2" />
          Test Controls
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Status:</h4>
        <div className="text-xs space-y-1">
          <div className={`${enrollmentData?.isEnrolled ? 'text-green-600' : 'text-red-600'}`}>
            Status: {enrollmentData?.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
          </div>
          {enrollmentData?.isEnrolled && (
            <div className="text-blue-600">
              Progress: {enrollmentData.userProgress?.toFixed(0)}%
            </div>
          )}
          {enrollmentData?.completedLessons && enrollmentData.completedLessons.length > 0 && (
            <div className="text-gray-600 dark:text-gray-400">
              Completed: {enrollmentData.completedLessons.length} lessons
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleEnroll}
          disabled={enrollmentData?.isEnrolled}
          className="w-full flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
        >
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Simulate Enrollment
        </button>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Reset to Not Enrolled
        </button>
      </div>

      {/* Lesson Completion */}
      {enrollmentData?.isEnrolled && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complete Lessons:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {mockLessons.map((lesson) => {
              const isCompleted = enrollmentData.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonComplete(lesson.id, lesson.title)}
                  disabled={isCompleted}
                  className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded transition-colors ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-gray-300'
                  }`}
                >
                  <span className="truncate">{lesson.title}</span>
                  {isCompleted ? (
                    <CheckCircleIcon className="h-3 w-3 ml-1 flex-shrink-0" />
                  ) : (
                    <PlayIcon className="h-3 w-3 ml-1 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-neutral-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          🧪 Dev Mode: Test different enrollment states
        </p>
      </div>
    </div>
  );
}
