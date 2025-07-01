import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { StatCard } from '@/components/ui';
import { StatCardData, QuickAccessLink, DashboardContent } from '../types/dashboard';

interface DashboardStatGridProps {
  statistics: StatCardData[];
}

export const DashboardStatGrid: React.FC<DashboardStatGridProps> = ({ statistics }) => (
  <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {statistics.map(stat => (
      <StatCard key={stat.title} {...stat} />
    ))}
  </section>
);

interface ActivityListProps {
  activities: any[];
  maxItems?: number;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, maxItems = 3 }) => (
  <ul className="space-y-4">
    {activities.slice(0, maxItems).map(activity => (
      <li key={activity.id} className="flex items-start text-sm group">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/30 transition-colors">
          <activity.icon className="h-4 w-4 text-brand-purple dark:text-purple-400" />
        </div>
        <div>
          <span className="dark:text-neutral-200">{activity.text || activity.title}</span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {activity.time || activity.description}
          </p>
        </div>
      </li>
    ))}
  </ul>
);

interface NewLaunchCardProps {
  launch: any;
}

export const NewLaunchCard: React.FC<NewLaunchCardProps> = ({ launch }) => (
  <Link 
    href={launch.href || "#"} 
    className="group flex items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/60 transition-all duration-300 border border-transparent hover:border-brand-purple/30 dark:hover:border-purple-500/40"
  >
    <Image 
      src={launch.image || "/images/course-placeholder.jpg"} 
      alt={launch.title} 
      width={100} 
      height={75} 
      className="rounded-lg object-cover mr-5 shadow-md group-hover:shadow-lg transition-shadow" 
    />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-md group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">
          {launch.title}
        </h3>
        {launch.new && (
          <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-semibold">
            BARU
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
        {launch.type || launch.description}
      </p>
    </div>
    <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-neutral-500 ml-3 transform group-hover:translate-x-1 transition-transform duration-300"/>
  </Link>
);

interface ProgressCardProps {
  progress: number;
  role: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, role }) => (
  <div>
    <h2 className="text-2xl font-bold mb-3 dark:text-neutral-100">
      Progres Belajar Anda
    </h2>
    <div className="flex items-center mb-2">
      <p className="text-3xl font-bold text-brand-purple dark:text-purple-400">{progress}%</p>
      {role === 'USER' && (
        <span className="ml-2 text-sm text-green-500 dark:text-green-400 flex items-center">
          +5% minggu ini
        </span>
      )}
    </div>
    <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 text-center">
      {role === 'USER' 
        ? 'Hebat! Terus pertahankan momentum belajar Anda.' 
        : 'Ringkasan progres siswa Anda.'
      }
    </p>
  </div>
);

interface QuickAccessGridProps {
  links: QuickAccessLink[];
}

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ links }) => (
  <div className="grid grid-cols-2 gap-4">
    {links.map(link => (
      <Link 
        key={link.title} 
        href={link.href} 
        className="group flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-neutral-700/70 rounded-xl hover:bg-brand-purple/10 dark:hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-3 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/40 transition-colors mb-2">
          <link.icon className="h-6 w-6 text-brand-purple dark:text-purple-400" />
        </div>
        <span className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-200 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">
          {link.title}
        </span>
      </Link>
    ))}
  </div>
);

interface DeadlineListProps {
  deadlines: any[];
  maxItems?: number;
}

export const DeadlineList: React.FC<DeadlineListProps> = ({ deadlines, maxItems = 3 }) => (
  <div className="space-y-4">
    {deadlines.slice(0, maxItems).map(deadline => (
      <div 
        key={deadline.id} 
        className={`p-4 rounded-lg border-l-4 ${
          deadline.urgency === 'high' || deadline.color === 'red' 
            ? 'border-red-500 bg-red-50 dark:bg-red-700/20' :
          deadline.urgency === 'medium' || deadline.color === 'orange'
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-700/20' :
            'border-blue-500 bg-blue-50 dark:bg-blue-700/20'
        }`}
      >
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm dark:text-neutral-100">{deadline.title}</h4>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            deadline.urgency === 'high' || deadline.color === 'red'
              ? 'bg-red-200 dark:bg-red-600/50 text-red-700 dark:text-red-200' :
            deadline.urgency === 'medium' || deadline.color === 'orange'
              ? 'bg-orange-200 dark:bg-orange-600/50 text-orange-700 dark:text-orange-200' :
              'bg-blue-200 dark:bg-blue-600/50 text-blue-700 dark:text-blue-200'
          }`}>
            {deadline.type || 'Deadline'}
          </span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
          {deadline.course && deadline.course !== "N/A" && `${deadline.course} - `}
          <span className={`font-semibold ${
            deadline.urgency === 'high' || deadline.color === 'red' 
              ? 'text-red-600 dark:text-red-400' : 
            deadline.urgency === 'medium' || deadline.color === 'orange'
              ? 'text-orange-600 dark:text-orange-400' : 
              'text-blue-600 dark:text-blue-400'
          }`}>
            {deadline.dueDate || deadline.due}
          </span>
        </p>
      </div>
    ))}
  </div>
);

interface CompletedCoursesListProps {
  courses: any[];
  maxItems?: number;
}

export const CompletedCoursesList: React.FC<CompletedCoursesListProps> = ({ courses, maxItems = 2 }) => (
  <ul className="space-y-4">
    {courses.slice(0, maxItems).map(course => (
      <li key={course.id} className="flex justify-between items-center text-sm p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/60 transition-colors">
        <div>
          <h4 className="font-semibold dark:text-neutral-200">{course.title}</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {course.completionDate ? `Selesai: ${course.completionDate}` : course.description}
          </p>
        </div>
        <a 
          href={course.certificateLink || "#"} 
          className="text-xs text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center"
        >
          Sertifikat <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5"/>
        </a>
      </li>
    ))}
  </ul>
);

interface NotificationBannerProps {
  notification: any;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification }) => (
  <div className={`flex items-center p-4 rounded-xl text-sm shadow-md transition-all hover:shadow-lg ${
    notification.urgency === 'high' || notification.type === 'deadline' 
      ? 'bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-200 border-l-4 border-red-500' 
      : 'bg-blue-100 dark:bg-blue-700/30 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
  }`}>
    {notification.icon && (
      <notification.icon className={`h-6 w-6 mr-3 flex-shrink-0 ${
        notification.urgency === 'high' || notification.type === 'deadline' 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-blue-600 dark:text-blue-400'
      }`} />
    )}
    <span className="font-medium">{notification.text || notification.title}</span>
  </div>
); 