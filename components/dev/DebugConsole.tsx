/**
 * Debug Console Component - Developer Testing Utilities
 * Provides console commands and debugging tools for enrollment testing
 */

"use client";

import React, { useEffect } from 'react';
import { 
  simulateEnrollment, 
  simulateLessonComplete, 
  resetEnrollment,
  getTestEnrollmentData,
  setTestEnrollmentData 
} from '@/lib/utils/testEnrollment';

interface DebugConsoleProps {
  courseSlug: string;
}

export default function DebugConsole({ courseSlug }: DebugConsoleProps) {
  useEffect(() => {
    // Only expose in development
    if (process.env.NODE_ENV !== 'development') return;

    // Check if already initialized to prevent re-initialization
    if ((window as any).testUtils) return;

    // Expose utility functions to global window for console access
    (window as any).testUtils = {
      // Core functions
      getTestEnrollmentData: (slug: string = courseSlug) => {
        const data = getTestEnrollmentData(slug);
        console.log(`📊 Test Enrollment Data for "${slug}":`, data);
        return data;
      },

      simulateEnrollment: (slug: string = courseSlug) => {
        simulateEnrollment(slug);
        console.log(`✅ Simulated enrollment for "${slug}"`);
        return getTestEnrollmentData(slug);
      },

      simulateLessonComplete: (lessonId: string, lessonTitle: string, slug: string = courseSlug) => {
        simulateLessonComplete(slug, lessonId, lessonTitle);
        console.log(`✅ Completed lesson "${lessonTitle}" (${lessonId}) for "${slug}"`);
        return getTestEnrollmentData(slug);
      },

      resetEnrollment: (slug: string = courseSlug) => {
        resetEnrollment(slug);
        console.log(`🔄 Reset enrollment for "${slug}"`);
        return getTestEnrollmentData(slug);
      },

      // Batch operations
      simulateProgress: (percentage: number, slug: string = courseSlug) => {
        if (percentage < 0 || percentage > 100) {
          console.error('❌ Progress must be between 0-100');
          return;
        }

        // First enroll if not already enrolled
        const currentData = getTestEnrollmentData(slug);
        if (!currentData.isEnrolled) {
          simulateEnrollment(slug);
        }

        // Calculate lessons to complete based on percentage
        const totalLessons = 10; // Assuming 10 lessons per course
        const lessonsToComplete = Math.floor((percentage / 100) * totalLessons);
        
        const completedLessons = [];
        for (let i = 1; i <= lessonsToComplete; i++) {
          const lessonId = `lesson-${i}`;
          const lessonTitle = `Lesson ${i}`;
          simulateLessonComplete(slug, lessonId, lessonTitle);
          completedLessons.push(lessonTitle);
        }

        // Update progress manually
        const updatedData = {
          ...getTestEnrollmentData(slug),
          userProgress: percentage,
        };
        setTestEnrollmentData(slug, updatedData);

        console.log(`📈 Set progress to ${percentage}% for "${slug}"`);
        console.log(`✅ Completed lessons:`, completedLessons);
        return getTestEnrollmentData(slug);
      },

      // Testing scenarios
      testScenario1: (slug: string = courseSlug) => {
        console.log('🎯 Testing Scenario 1: Non-Enrolled User');
        resetEnrollment(slug);
        setTimeout(() => window.location.reload(), 500);
      },

      testScenario2: (slug: string = courseSlug) => {
        console.log('🎯 Testing Scenario 2: Just Enrolled (0% Progress)');
        resetEnrollment(slug);
        simulateEnrollment(slug);
        setTimeout(() => window.location.reload(), 500);
      },

      testScenario3: (slug: string = courseSlug) => {
        console.log('🎯 Testing Scenario 3: Learning Progress (50%)');
        (window as any).testUtils.simulateProgress(50, slug);
        setTimeout(() => window.location.reload(), 500);
      },

      testScenario4: (slug: string = courseSlug) => {
        console.log('🎯 Testing Scenario 4: Course Completed (100%)');
        (window as any).testUtils.simulateProgress(100, slug);
        setTimeout(() => window.location.reload(), 500);
      },

      // Utility functions
      clearAllTestData: () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('test_enrollment_data'));
        keys.forEach(key => localStorage.removeItem(key));
        console.log('🧹 Cleared all test enrollment data');
        setTimeout(() => window.location.reload(), 500);
      },

      listAllTestData: () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('test_enrollment_data'));
        const data = keys.map(key => ({
          course: key.replace('test_enrollment_data_', ''),
          data: JSON.parse(localStorage.getItem(key) || '{}')
        }));
        console.log('📋 All Test Enrollment Data:', data);
        return data;
      },

      // Help function
      help: () => {
        console.log(`
🧪 LMS Testing Utilities - Available Commands:

📊 Data Functions:
  testUtils.getTestEnrollmentData()           - Get current enrollment data
  testUtils.listAllTestData()                 - List all test data
  testUtils.clearAllTestData()                - Clear all test data

🎯 Enrollment Functions:
  testUtils.simulateEnrollment()              - Enroll user in course
  testUtils.resetEnrollment()                 - Reset to non-enrolled state
  testUtils.simulateProgress(percentage)      - Set progress (0-100)
  testUtils.simulateLessonComplete(id, title) - Complete specific lesson

🧪 Test Scenarios:
  testUtils.testScenario1()                   - Non-enrolled user
  testUtils.testScenario2()                   - Just enrolled (0%)
  testUtils.testScenario3()                   - Learning progress (50%)
  testUtils.testScenario4()                   - Course completed (100%)

💡 Examples:
  testUtils.simulateProgress(75)              - Set 75% progress
  testUtils.simulateLessonComplete('1', 'Intro') - Complete lesson
  testUtils.testScenario3()                   - Quick test partial progress

Current course: "${courseSlug}"
        `);
      }
    };

    // Show welcome message
    console.log(`
🧪 LMS Testing Utilities Loaded!
================================
Course: "${courseSlug}"

Type 'testUtils.help()' for available commands.
Type 'testUtils.getTestEnrollmentData()' to see current state.

Quick start:
- testUtils.testScenario1() // Test non-enrolled
- testUtils.testScenario2() // Test just enrolled
- testUtils.testScenario3() // Test 50% progress
- testUtils.testScenario4() // Test completed
    `);

    // Cleanup function
    return () => {
      if ((window as any).testUtils) {
        delete (window as any).testUtils;
      }
    };
  }, []); // Empty dependency array - only run once

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return null; // This component only exposes console utilities
}
