import { Lesson, Module } from '@/lib/types';

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
  return remainingMinutes > 0 ? `${hours}j ${remainingMinutes}m` : `${hours}j`;
};

export const calculateTotalDuration = (modules: Module[]): number => {
  const allLessons = getAllLessons(modules);
  return allLessons.reduce(
    (total, lesson) => total + (lesson.durationMinutes || 0),
    0
  );
};

export const calculateProgress = (modules: Module[]): number => {
  const allLessons = getAllLessons(modules);
  if (allLessons.length === 0) return 0;
  
  const completedLessons = allLessons.filter(
    lesson => lesson.status === "selesai"
  ).length;
  
  return Math.round((completedLessons / allLessons.length) * 100);
};

export const getLessonTypeIcon = (type: Lesson['type']): string => {
  const iconMap = {
    video: "📹",
    bacaan: "📖", 
    kuis: "❓",
    tugas: "📝",
    interaktif: "🎮"
  };
  return iconMap[type] || "📄";
};

export const getLessonStatusColor = (status: Lesson['status']): string => {
  const colorMap = {
    selesai: "text-green-600 bg-green-100",
    terkunci: "text-gray-400 bg-gray-100",
    sedang_dipelajari: "text-blue-600 bg-blue-100", 
    selanjutnya: "text-orange-600 bg-orange-100"
  };
  return colorMap[status] || "text-gray-600 bg-gray-100";
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export const formatPrice = (price: number | string | undefined): string => {
  if (!price) return "N/A";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "N/A";
  return `Rp${numPrice.toLocaleString("id-ID")}`;
};
