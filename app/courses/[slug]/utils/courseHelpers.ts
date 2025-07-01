import { Lesson, Module } from '../types/course';

export const getAllLessons = (modules: Module[]): Lesson[] => 
  modules.flatMap(module => module.lessons);

export const getCurrentLessonIndex = (lessons: Lesson[], lessonId: string): number =>
  lessons.findIndex(l => l.id === lessonId);

export const getNextLesson = (lessons: Lesson[], currentIndex: number): Lesson | null =>
  currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

export const getPreviousLesson = (lessons: Lesson[], currentIndex: number): Lesson | null =>
  currentIndex > 0 ? lessons[currentIndex - 1] : null;

export const getLessonNavigation = (modules: Module[], currentLesson: Lesson) => {
  const allLessons = getAllLessons(modules);
  const currentIndex = getCurrentLessonIndex(allLessons, currentLesson.id);
  
  return {
    allLessons,
    currentIndex,
    nextLesson: getNextLesson(allLessons, currentIndex),
    previousLesson: getPreviousLesson(allLessons, currentIndex),
  };
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} mnt`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}j ${remainingMinutes}m` : `${hours} jam`;
};

export const calculateCourseProgress = (modules: Module[]): number => {
  const allLessons = getAllLessons(modules);
  if (allLessons.length === 0) return 0;
  
  const completedLessons = allLessons.filter(lesson => lesson.status === 'selesai');
  return Math.round((completedLessons.length / allLessons.length) * 100);
};

export const formatPrice = (price: number): string => {
  return `Rp${price.toLocaleString("id-ID")}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}; 