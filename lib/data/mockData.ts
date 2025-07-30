import { User } from '@/contexts/AuthContext';

// User Mock Data
export const mockUsers: User[] = [
  {
    id: 1,
    username: "daniinstructor",
    email: "dani@devva.com",
    role: "TEACHER",
    name: "Dani Rahman",
    avatarUrl: "https://i.pravatar.cc/400",
    bio: "Experienced full-stack developer with 8+ years in web development. Passionate about teaching modern JavaScript frameworks.",
    department: "Computer Science"
  },
  {
    id: 2,
    username: "sarah_teacher",
    email: "sarah@devva.com",
    role: "TEACHER",
    name: "Sarah Wilson",
    avatarUrl: "https://i.pravatar.cc/400?img=2",
    bio: "UI/UX designer turned educator. Specializing in design systems and user experience.",
    department: "Design"
  },
  {
    id: 3,
    username: "student_alex",
    email: "alex@example.com",
    role: "USER",
    name: "Alex Johnson",
    avatarUrl: "https://i.pravatar.cc/400?img=3",
    bio: "Aspiring developer learning web technologies",
    department: "Student"
  },
  {
    id: 4,
    username: "admin_mike",
    email: "mike@devva.com",
    role: "ADMIN",
    name: "Mike Chen",
    avatarUrl: "https://i.pravatar.cc/400?img=4",
    bio: "Platform administrator and course coordinator",
    department: "Administration"
  }
];

// Course Mock Data
export interface MockCourse {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorId: number;
  instructor: {
    name: string;
    avatarUrl: string;
    bio: string;
    title: string;
    coursesCount: number;
    studentsCount: number;
    rating: number;
  };
  category: string;
  level: string;
  price: number;
  published: boolean;
  rating: number;
  lessonsCount: number;
  totalDurationHours: number;
  isNew: boolean;
  tags: string[];
  slug: string;
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
  youtubeThumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  studentsEnrolled: number;
  _count: {
    enrollments: number;
    modules: number;
  };
}

export const mockCourses: MockCourse[] = [
  {
    id: 1,
    title: "Complete React & Next.js Development",
    description: "Master modern React development with Next.js, TypeScript, and advanced patterns. Build production-ready applications from scratch.",
    thumbnailUrl: "https://youtu.be/k4eSitgTKSc?si=Z198lel2kY1LqmZz",
    instructorId: 1,
    instructor: {
      name: "Dani Rahman",
      avatarUrl: "https://i.pravatar.cc/400",
      bio: "Experienced full-stack developer with 8+ years in web development",
      title: "Senior Full-Stack Developer",
      coursesCount: 5,
      studentsCount: 1250,
      rating: 4.8
    },
    category: "Web Development",
    level: "Menengah",
    price: 299000,
    published: true,
    rating: 4.7,
    lessonsCount: 42,
    totalDurationHours: 15,
    isNew: true,
    tags: ["React", "Next.js", "TypeScript", "JavaScript"],
    slug: "complete-react-nextjs-development",
    youtubeEmbedUrl: "https://youtu.be/k4eSitgTKSc?si=Z198lel2kY1LqmZz",
    youtubeVideoId: "w7ejDZ8SWv8",
    youtubeThumbnailUrl: "https://youtu.be/k4eSitgTKSc?si=Z198lel2kY1LqmZz",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    studentsEnrolled: 1250,
    _count: {
      enrollments: 1250,
      modules: 8
    }
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design. Create beautiful, functional designs that users love.",
    thumbnailUrl: "https://youtu.be/k4eSitgTKSc?si=Z198lel2kY1LqmZz",
    instructorId: 2,
    instructor: {
      name: "Sarah Wilson",
      avatarUrl: "https://i.pravatar.cc/400?img=2",
      bio: "UI/UX designer turned educator",
      title: "Lead UI/UX Designer",
      coursesCount: 3,
      studentsCount: 850,
      rating: 4.9
    },
    category: "UI/UX Design",
    level: "Pemula",
    price: 199000,
    published: true,
    rating: 4.9,
    lessonsCount: 28,
    totalDurationHours: 12,
    isNew: false,
    tags: ["UI Design", "UX Design", "Figma", "Prototyping"],
    slug: "uiux-design-fundamentals",
    youtubeEmbedUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    youtubeVideoId: "c9Wg6Cb_YlU",
    youtubeThumbnailUrl: "https://youtu.be/k4eSitgTKSc?si=Z198lel2kY1LqmZz",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
    studentsEnrolled: 850,
    _count: {
      enrollments: 850,
      modules: 6
    }
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Complete guide to Python programming for data analysis, visualization, and machine learning. Perfect for beginners.",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
    instructorId: 1,
    instructor: {
      name: "Dani Rahman",
      avatarUrl: "https://i.pravatar.cc/400",
      bio: "Experienced full-stack developer with 8+ years in web development",
      title: "Senior Full-Stack Developer",
      coursesCount: 5,
      studentsCount: 1250,
      rating: 4.8
    },
    category: "Data Science",
    level: "Pemula",
    price: 249000,
    published: true,
    rating: 4.6,
    lessonsCount: 35,
    totalDurationHours: 18,
    isNew: true,
    tags: ["Python", "Data Science", "Pandas", "NumPy"],
    slug: "python-for-data-science",
    youtubeEmbedUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
    youtubeVideoId: "rfscVS0vtbw",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-22T16:00:00Z",
    studentsEnrolled: 920,
    _count: {
      enrollments: 920,
      modules: 7
    }
  },
  {
    id: 4,
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course covering SEO, social media, content marketing, and paid advertising strategies.",
    thumbnailUrl: "https://img.youtube.com/vi/0GwYU6xaTcU/hqdefault.jpg",
    instructorId: 2,
    instructor: {
      name: "Sarah Wilson",
      avatarUrl: "https://i.pravatar.cc/400?img=2",
      bio: "UI/UX designer turned educator",
      title: "Lead UI/UX Designer",
      coursesCount: 3,
      studentsCount: 850,
      rating: 4.9
    },
    category: "Digital Marketing",
    level: "Menengah",
    price: 199000,
    published: true,
    rating: 4.5,
    lessonsCount: 32,
    totalDurationHours: 14,
    isNew: false,
    tags: ["SEO", "Social Media", "Content Marketing", "PPC"],
    slug: "digital-marketing-mastery",
    youtubeEmbedUrl: "https://www.youtube.com/embed/0GwYU6xaTcU",
    youtubeVideoId: "0GwYU6xaTcU",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/0GwYU6xaTcU/hqdefault.jpg",
    createdAt: "2024-01-08T07:00:00Z",
    updatedAt: "2024-01-25T11:30:00Z",
    studentsEnrolled: 675,
    _count: {
      enrollments: 675,
      modules: 5
    }
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native. Learn navigation, state management, and native features.",
    thumbnailUrl: "https://img.youtube.com/vi/0-S5a0eXPoc/hqdefault.jpg",
    instructorId: 1,
    instructor: {
      name: "Dani Rahman",
      avatarUrl: "https://i.pravatar.cc/400",
      bio: "Experienced full-stack developer with 8+ years in web development",
      title: "Senior Full-Stack Developer",
      coursesCount: 5,
      studentsCount: 1250,
      rating: 4.8
    },
    category: "Mobile Development",
    level: "Lanjutan",
    price: 349000,
    published: false,
    rating: 0,
    lessonsCount: 0,
    totalDurationHours: 0,
    isNew: true,
    tags: ["React Native", "Mobile Development", "JavaScript", "Cross-platform"],
    slug: "mobile-app-development-react-native",
    youtubeEmbedUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
    youtubeVideoId: "0-S5a0eXPoc",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/0-S5a0eXPoc/hqdefault.jpg",
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
    studentsEnrolled: 0,
    _count: {
      enrollments: 0,
      modules: 0
    }
  }
];

// Lesson Mock Data
export interface MockLesson {
  id: number;
  title: string;
  content?: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  duration: number; // in minutes
  order: number;
  moduleId: number;
  courseId: number;
  isPreviewable: boolean;
  completed: boolean;
}

export const mockLessons: MockLesson[] = [
  // Course 1 lessons
  {
    id: 1,
    title: "Introduction to React",
    content: "Learn the basics of React and component-based architecture",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    duration: 25,
    order: 1,
    moduleId: 1,
    courseId: 1,
    isPreviewable: true,
    completed: false
  },
  {
    id: 2,
    title: "JSX and Component Basics",
    content: "Understanding JSX syntax and creating your first components",
    youtubeUrl: "https://www.youtube.com/watch?v=3rhSPKuPLbE",
    youtubeVideoId: "3rhSPKuPLbE",
    duration: 30,
    order: 2,
    moduleId: 1,
    courseId: 1,
    isPreviewable: false,
    completed: false
  },
  {
    id: 3,
    title: "Props and State Management",
    content: "Learn how to pass data between components and manage state",
    youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    youtubeVideoId: "rfscVS0vtbw",
    duration: 35,
    order: 3,
    moduleId: 1,
    courseId: 1,
    isPreviewable: false,
    completed: false
  },
  // Course 2 lessons
  {
    id: 4,
    title: "Design Principles",
    content: "Understanding fundamental design principles",
    youtubeUrl: "https://www.youtube.com/watch?v=gCL7VdZl9HE",
    youtubeVideoId: "gCL7VdZl9HE",
    duration: 20,
    order: 1,
    moduleId: 2,
    courseId: 2,
    isPreviewable: true,
    completed: false
  },
  {
    id: 5,
    title: "Color Theory",
    content: "Learn about color psychology and application in design",
    youtubeUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
    youtubeVideoId: "0-S5a0eXPoc",
    duration: 28,
    order: 2,
    moduleId: 2,
    courseId: 2,
    isPreviewable: false,
    completed: false
  }
];

// Module Mock Data
export interface MockModule {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
  lessons: MockLesson[];
}

export const mockModules: MockModule[] = [
  {
    id: 1,
    title: "React Fundamentals",
    description: "Learn the core concepts of React development",
    courseId: 1,
    order: 1,
    lessons: mockLessons.filter(lesson => lesson.moduleId === 1)
  },
  {
    id: 2,
    title: "Design Fundamentals",
    description: "Core principles of effective design",
    courseId: 2,
    order: 1,
    lessons: mockLessons.filter(lesson => lesson.moduleId === 2)
  }
];

// Enrollment Mock Data
export interface MockEnrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  course: MockCourse;
}

export const mockEnrollments: MockEnrollment[] = [
  {
    id: 1,
    userId: 3,
    courseId: 1,
    enrolledAt: "2024-01-20T10:00:00Z",
    progress: 45,
    completed: false,
    course: mockCourses[0]
  },
  {
    id: 2,
    userId: 3,
    courseId: 2,
    enrolledAt: "2024-01-18T14:30:00Z",
    progress: 100,
    completed: true,
    course: mockCourses[1]
  }
];

// Dashboard Content Mock Data
export interface MockDashboardContent {
  id: string;
  title: string;
  description: string;
  contentType: 'activity' | 'course' | 'news' | 'deadline' | 'notification';
  date?: string;
  thumbnailUrl?: string;
  url?: string;
  category?: string;
  icon?: any;
}

export const mockDashboardData = {
  activities: [
    {
      id: "1",
      title: "Completed React Hooks lesson",
      description: "You successfully completed the React Hooks lesson in Complete React Development",
      contentType: "activity" as const,
      date: "2024-01-25T10:30:00Z",
      url: "/courses/complete-react-nextjs-development"
    },
    {
      id: "2", 
      title: "Started new course",
      description: "You enrolled in UI/UX Design Fundamentals",
      contentType: "activity" as const,
      date: "2024-01-24T15:20:00Z",
      url: "/courses/uiux-design-fundamentals"
    }
  ],
  news: [
    {
      id: "1",
      title: "New Course: Python for Data Science",
      description: "We've launched a comprehensive Python course for data science beginners",
      contentType: "news" as const,
      date: "2024-01-25T09:00:00Z",
      thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
      url: "/courses/python-for-data-science"
    }
  ],
  deadlines: [
    {
      id: "1",
      title: "Assignment Due: React Project",
      description: "Complete your React portfolio project submission",
      contentType: "deadline" as const,
      date: "2024-01-28T23:59:00Z",
      url: "/courses/complete-react-nextjs-development"
    }
  ],
  notifications: [
    {
      id: "1",
      title: "Course Update Available",
      description: "New lessons have been added to your enrolled courses",
      contentType: "notification" as const,
      date: "2024-01-25T08:00:00Z"
    }
  ]
};

// Analytics Mock Data
export const mockAnalyticsData = {
  kpis: [
    { label: "Total Students", value: "2,845", change: "+12%", trend: "up" },
    { label: "Active Courses", value: "24", change: "+3", trend: "up" },
    { label: "Total Revenue", value: "$45,200", change: "+8%", trend: "up" },
    { label: "Completion Rate", value: "87%", change: "+5%", trend: "up" }
  ],
  chartData: {
    enrollment: [
      { month: "Jan", students: 150 },
      { month: "Feb", students: 200 },
      { month: "Mar", students: 280 },
      { month: "Apr", students: 220 },
      { month: "May", students: 350 },
      { month: "Jun", students: 400 }
    ],
    revenue: [
      { month: "Jan", amount: 5200 },
      { month: "Feb", amount: 7800 },
      { month: "Mar", amount: 9200 },
      { month: "Apr", amount: 6800 },
      { month: "May", amount: 12500 },
      { month: "Jun", amount: 15200 }
    ]
  },
  popularCourses: [
    { name: "React Development", students: 1250, rating: 4.7 },
    { name: "UI/UX Design", students: 850, rating: 4.9 },
    { name: "Python Data Science", students: 920, rating: 4.6 }
  ],
  teacherPerformance: {
    avgRating: 4.7,
    totalStudents: 2095,
    completionRate: 87
  }
};

// Support/FAQ Mock Data
export const mockSupportData = {
  categories: [
    {
      id: "1",
      title: "Account Management",
      description: "Profile, login, and account settings",
      iconType: "account",
      articleCount: 12
    },
    {
      id: "2", 
      title: "Course Access",
      description: "Enrollment, progress, and content issues",
      iconType: "course",
      articleCount: 18
    },
    {
      id: "3",
      title: "Payment & Billing",
      description: "Pricing, refunds, and payment methods",
      iconType: "payment",
      articleCount: 8
    },
    {
      id: "4",
      title: "Technical Support",
      description: "Video playback, platform issues",
      iconType: "technical",
      articleCount: 15
    }
  ],
  faqs: [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page and following the email instructions."
    },
    {
      question: "Can I download course videos?",
      answer: "Course videos are streamed online for the best experience. Offline viewing is not currently available."
    },
    {
      question: "How do I get a refund?",
      answer: "We offer a 30-day money-back guarantee. Contact support with your course details for refund processing."
    }
  ]
};

// Webinar Mock Data
export const mockWebinarData = {
  webinars: [
    {
      id: "1",
      title: "Future of Web Development",
      description: "Explore upcoming trends and technologies in web development",
      date: "2024-02-15T19:00:00Z",
      duration: 90,
      instructor: "Dani Rahman",
      thumbnailUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
      status: "upcoming",
      attendeesCount: 245,
      category: "Web Development"
    },
    {
      id: "2",
      title: "Design Systems Workshop",
      description: "Learn how to build and maintain design systems",
      date: "2024-02-20T20:00:00Z",
      duration: 120,
      instructor: "Sarah Wilson", 
      thumbnailUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop",
      status: "upcoming",
      attendeesCount: 189,
      category: "UI/UX Design"
    }
  ],
  categories: ["Semua Kategori", "Web Development", "UI/UX Design", "Data Science", "Digital Marketing"]
};

// Messages Mock Data
export const mockMessageData = {
  contacts: [
    {
      id: "1",
      name: "Dani Rahman",
      avatarUrl: "https://i.pravatar.cc/400",
      lastMessage: "Thanks for the question about React hooks!",
      lastMessageTime: "2024-01-25T15:30:00Z",
      isOnline: true,
      role: "instructor"
    },
    {
      id: "2",
      name: "Sarah Wilson",
      avatarUrl: "https://i.pravatar.cc/400?img=2",
      lastMessage: "The design critique session was very helpful",
      lastMessageTime: "2024-01-24T18:45:00Z",
      isOnline: false,
      role: "instructor"
    }
  ],
  messages: [
    {
      id: "1",
      senderId: "1",
      content: "Hi! I have a question about the React hooks lesson",
      timestamp: "2024-01-25T15:25:00Z",
      isMe: true
    },
    {
      id: "2",
      senderId: "1",
      content: "Thanks for the question about React hooks! The key thing to remember is that hooks must be called in the same order every time.",
      timestamp: "2024-01-25T15:30:00Z",
      isMe: false
    }
  ]
};

// Payment Mock Data
export const mockPaymentData = {
  currentBill: {
    amount: 299000,
    dueDate: "2024-02-15T00:00:00Z",
    courseName: "Complete React & Next.js Development",
    status: "pending"
  },
  paymentHistory: [
    {
      id: "1",
      amount: 199000,
      date: "2024-01-18T10:00:00Z",
      courseName: "UI/UX Design Fundamentals",
      status: "completed",
      paymentMethod: "Credit Card"
    },
    {
      id: "2",
      amount: 249000,
      date: "2024-01-12T14:30:00Z",
      courseName: "Python for Data Science",
      status: "completed",
      paymentMethod: "Bank Transfer"
    }
  ]
};

// Default mock user for initial login
export const defaultMockUser: User = mockUsers[0]; // Dani as default logged in user 