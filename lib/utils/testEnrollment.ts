/**
 * Test Utilities for Enrollment Flow
 * Simulates user enrollment status for testing purposes
 */

export interface TestEnrollmentData {
  isEnrolled: boolean;
  userProgress: number;
  lastAccessedLessonId?: string;
  lastAccessedLessonTitle?: string;
  lastAccessedLessonUrl?: string;
  enrolledAt?: string;
  completedLessons: string[];
}

// Local storage key for test enrollment data
const ENROLLMENT_STORAGE_KEY = 'test_enrollment_data';

/**
 * Get test enrollment data for a course
 */
export function getTestEnrollmentData(courseSlug: string): TestEnrollmentData {
  if (typeof window === 'undefined') {
    return getDefaultEnrollmentData();
  }

  try {
    const stored = localStorage.getItem(`${ENROLLMENT_STORAGE_KEY}_${courseSlug}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error reading test enrollment data:', error);
  }

  return getDefaultEnrollmentData();
}

/**
 * Set test enrollment data for a course
 */
export function setTestEnrollmentData(courseSlug: string, data: TestEnrollmentData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${ENROLLMENT_STORAGE_KEY}_${courseSlug}`, JSON.stringify(data));
    // Trigger a custom event to notify components of enrollment change
    window.dispatchEvent(new CustomEvent('enrollmentChanged', { 
      detail: { courseSlug, data } 
    }));
  } catch (error) {
    console.warn('Error saving test enrollment data:', error);
  }
}

/**
 * Simulate user enrollment
 */
export function simulateEnrollment(courseSlug: string): void {
  const enrollmentData: TestEnrollmentData = {
    isEnrolled: true,
    userProgress: 0,
    enrolledAt: new Date().toISOString(),
    completedLessons: []
  };
  
  setTestEnrollmentData(courseSlug, enrollmentData);
  console.log('🎉 Simulated enrollment for course:', courseSlug);
}

/**
 * Simulate lesson completion
 */
export function simulateLessonComplete(courseSlug: string, lessonId: string, lessonTitle: string): void {
  const currentData = getTestEnrollmentData(courseSlug);
  
  if (!currentData.isEnrolled) {
    console.warn('Cannot complete lesson: User not enrolled');
    return;
  }

  const updatedData: TestEnrollmentData = {
    ...currentData,
    completedLessons: [...new Set([...currentData.completedLessons, lessonId])],
    lastAccessedLessonId: lessonId,
    lastAccessedLessonTitle: lessonTitle,
    lastAccessedLessonUrl: `/courses/${courseSlug}/lessons/${lessonId}`,
  };

  // Calculate progress based on completed lessons (assuming 10 total lessons for demo)
  const totalLessons = 10;
  updatedData.userProgress = Math.min(100, (updatedData.completedLessons.length / totalLessons) * 100);

  setTestEnrollmentData(courseSlug, updatedData);
  console.log('✅ Simulated lesson completion:', lessonTitle);
}

/**
 * Reset enrollment (for testing)
 */
export function resetEnrollment(courseSlug: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(`${ENROLLMENT_STORAGE_KEY}_${courseSlug}`);
  window.dispatchEvent(new CustomEvent('enrollmentChanged', { 
    detail: { courseSlug, data: getDefaultEnrollmentData() } 
  }));
  console.log('🔄 Reset enrollment for course:', courseSlug);
}

/**
 * Get default enrollment data (not enrolled)
 */
function getDefaultEnrollmentData(): TestEnrollmentData {
  return {
    isEnrolled: false,
    userProgress: 0,
    completedLessons: []
  };
}

/**
 * Generate mock lesson statuses based on enrollment and progress
 */
export function generateLessonStatuses(
  lessonIds: string[], 
  enrollmentData: TestEnrollmentData
): Record<string, 'selesai' | 'sedang_dipelajari' | 'selanjutnya' | 'terkunci'> {
  const statuses: Record<string, any> = {};
  
  if (!enrollmentData.isEnrolled) {
    // Non-enrolled users: first lesson previewable, others locked
    lessonIds.forEach((id, index) => {
      statuses[id] = index === 0 ? 'selanjutnya' : 'terkunci';
    });
  } else {
    // Enrolled users: dynamic status based on progress
    lessonIds.forEach((id, index) => {
      if (enrollmentData.completedLessons.includes(id)) {
        statuses[id] = 'selesai';
      } else if (id === enrollmentData.lastAccessedLessonId) {
        statuses[id] = 'sedang_dipelajari';
      } else if (index <= enrollmentData.completedLessons.length) {
        statuses[id] = 'selanjutnya';
      } else {
        statuses[id] = 'terkunci';
      }
    });
  }
  
  return statuses;
}
