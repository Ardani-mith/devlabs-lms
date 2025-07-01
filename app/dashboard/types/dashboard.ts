import { BaseContent } from '@/lib/types/content';
import { ComponentType } from 'react';

export interface DashboardContent extends Omit<BaseContent, 'thumbnailUrl' | 'category'> {
  contentType: 'activity' | 'news' | 'course' | 'deadline' | 'notification';
  icon?: ComponentType<{ className?: string }>;
  time?: string;
  dueDate?: string;
  urgency?: 'low' | 'medium' | 'high';
  course?: string;
  completionDate?: string;
  certificateLink?: string;
  new?: boolean;
  thumbnailUrl?: string;
  category?: string;
  image?: string;
}

export interface StatCardData {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href?: string;
}

export interface QuickAccessLink {
  title: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
}

export interface DashboardConfig {
  role: string;
  showStatistics: boolean;
  showProgress: boolean;
  showDeadlines: boolean;
  showCompletedCourses: boolean;
  showQuickAccess: boolean;
  showNotifications: boolean;
  sectionsLayout: {
    leftColumn: string[];
    rightColumn: string[];
  };
}

export interface UserDashboardData {
  statistics: StatCardData[];
  progress: number;
  quickAccessLinks: QuickAccessLink[];
  activities: DashboardContent[];
  news: DashboardContent[];
  deadlines: DashboardContent[];
  completedCourses: DashboardContent[];
  notifications: DashboardContent[];
  newLaunches: DashboardContent[];
} 