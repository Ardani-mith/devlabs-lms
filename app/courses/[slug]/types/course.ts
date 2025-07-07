export interface Lesson {
  id: string;
  title: string;
  type: "video" | "bacaan" | "kuis" | "tugas" | "interaktif";
  durationMinutes?: number;
  status: "selesai" | "terkunci" | "sedang_dipelajari" | "selanjutnya";
  url: string;
  isPreviewable?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isCollapsedInitially?: boolean;
}

export interface DiscussionReply {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: "Siswa" | "Pengajar";
  timestamp: string;
  text: string;
  likes?: number;
}

export interface DiscussionComment {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: "Siswa" | "Pengajar";
  timestamp: string;
  text: string;
  replies?: DiscussionReply[];
  likes?: number;
}

export interface CourseDetail {
  slug: string;
  title: string;
  tagline?: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorTitle?: string;
  instructorCoursesCount?: number;
  instructorStudentsCount?: number;
  instructorRating?: number;
  thumbnailUrl: string;
  bannerUrl?: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  userProgress: number;
  isEnrolled: boolean;
  lastAccessedLessonUrl?: string;
  lastAccessedLessonTitle?: string;
  price: number;
  originalPrice?: number;
  isPremium?: boolean;
  isOnSale?: boolean;
  saleEndDate?: string;
  fullDescription: string;
  whatYouWillLearn: string[];
  targetAudience: string[];
  prerequisites: string[];
  skillsYouWillGain?: string[];
  toolsYouWillUse?: string[];
  language: string;
  totalLessons: number;
  totalVideoHours?: number;
  totalDurationHours: number;
  hasCertificate: boolean;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  updatedAt: string;
  modules: Module[];
  discussions: DiscussionComment[];
  faq?: { question: string; answer: string }[];
  certificateUrl?: string;
  relatedCourses?: Pick<
    CourseDetail,
    | "slug"
    | "title"
    | "thumbnailUrl"
    | "instructorName"
    | "rating"
    | "category"
    | "price"
  >[];
  enrollmentTrend?: { date: string; count: number }[];
} 