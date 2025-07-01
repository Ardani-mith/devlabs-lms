"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  ClockIcon, 
  StarIcon, 
  UserCircleIcon,
  UsersIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  TagIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { Card } from '@/components/ui';
import { Content, ContentDisplayConfig } from '@/lib/types/content';

interface ContentCardProps {
  content: Content;
  config?: ContentDisplayConfig;
  onClick?: (content: Content) => void;
  className?: string;
}

// Default configuration for different content types
const defaultConfigs: Record<Content['type'], ContentDisplayConfig> = {
  course: {
    showInstructor: true,
    showRating: true,
    showPrice: true,
    showDuration: true,
    showTags: true,
    maxTags: 2,
    cardVariant: 'default',
  },
  teacher: {
    showRating: true,
    showStatus: true,
    showTags: true,
    maxTags: 3,
    cardVariant: 'default',
  },
  webinar: {
    showInstructor: true,
    showPrice: true,
    showStatus: true,
    showTags: true,
    maxTags: 2,
    cardVariant: 'default',
  },
  news: {
    showTags: true,
    maxTags: 2,
    cardVariant: 'default',
  },
};

export default function ContentCard({ 
  content, 
  config, 
  onClick, 
  className = '' 
}: ContentCardProps) {
  const displayConfig = { ...defaultConfigs[content.type], ...config };
  const href = getContentUrl(content);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(content);
    }
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href && !onClick) {
      return (
        <Link href={href} className="group block">
          {children}
        </Link>
      );
    }
    return (
      <div onClick={handleClick} className={onClick ? 'cursor-pointer group' : 'group'}>
        {children}
      </div>
    );
  };

  return (
    <CardWrapper>
      <Card
        variant="elevated"
        hover={true}
        className={`h-full flex flex-col overflow-hidden ${className}`}
      >
        {/* Thumbnail */}
        <div className="relative w-full h-48 sm:h-52">
          <Image
            src={content.thumbnailUrl || getDefaultThumbnail(content.type)}
            alt={content.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {content.isNew && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                BARU
              </span>
            )}
            {content.isFeatured && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center">
                <SparklesIcon className="h-3 w-3 mr-1" />
                FEATURED
              </span>
            )}
          </div>

          {/* Status/Level Badge */}
          <div className="absolute bottom-3 left-3">
            {renderStatusBadge(content, displayConfig)}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Category */}
          <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-1 uppercase tracking-wider">
            {content.category}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">
            {content.title}
          </h3>

          {/* Description */}
          {content.description && (
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3 line-clamp-2">
              {content.description}
            </p>
          )}

          {/* Instructor/Author/Host */}
          {displayConfig.showInstructor && renderInstructorInfo(content)}

          {/* Content Specific Info */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700 dark:text-neutral-300 my-3">
            {renderContentSpecificInfo(content, displayConfig)}
          </div>

          {/* Tags */}
          {displayConfig.showTags && content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 my-2">
              {content.tags.slice(0, displayConfig.maxTags || 2).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 rounded-full flex items-center"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-200 dark:border-neutral-700/60">
            {/* Rating or Meta Info */}
            {displayConfig.showRating && renderRating(content)}
            
            {/* Price or Action */}
            {displayConfig.showPrice && renderPrice(content)}
          </div>
        </div>
      </Card>
    </CardWrapper>
  );
}

// Helper functions
function getContentUrl(content: Content): string {
  switch (content.type) {
    case 'course':
      return content.courseUrl || `/courses/${content.id}`;
    case 'teacher':
      return `/teachers/${content.id}`;
    case 'webinar':
      return content.registrationUrl || `/webinar/${content.id}`;
    case 'news':
      return content.contentUrl || `/news/${content.id}`;
    default:
      return '#';
  }
}

function getDefaultThumbnail(type: Content['type']): string {
  const defaults = {
    course: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    teacher: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop',
    webinar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
  };
  return defaults[type];
}

function renderStatusBadge(content: Content, config: ContentDisplayConfig) {
  if (content.type === 'course') {
    const levelColors = {
      "Pemula": "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300",
      "Menengah": "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300",
      "Lanjutan": "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300",
      "Semua Level": "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300",
    };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColors[content.level]} shadow-sm`}>
        {content.level}
      </span>
    );
  }

  if (content.type === 'webinar' && config.showStatus) {
    const statusColors = {
      scheduled: "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300",
      live: "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300",
      completed: "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300",
      cancelled: "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300",
    };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[content.status]} shadow-sm`}>
        {content.status.toUpperCase()}
      </span>
    );
  }

  if (content.type === 'teacher' && config.showStatus) {
    const availabilityColors = {
      available: "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300",
      busy: "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300",
      offline: "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300",
    };
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${availabilityColors[content.availability || 'offline']} shadow-sm`}>
        {(content.availability || 'offline').toUpperCase()}
      </span>
    );
  }

  return null;
}

function renderInstructorInfo(content: Content) {
  let name = '';
  let avatarUrl = '';

  switch (content.type) {
    case 'course':
      name = content.instructorName;
      avatarUrl = content.instructorAvatarUrl || '';
      break;
    case 'webinar':
      name = content.hostName;
      avatarUrl = content.hostAvatarUrl || '';
      break;
    case 'news':
      name = content.authorName;
      avatarUrl = content.authorAvatarUrl || '';
      break;
    default:
      return null;
  }

  return (
    <div className="flex items-center text-xs text-gray-600 dark:text-neutral-400 mb-3">
      {avatarUrl ? (
        <Image 
          src={avatarUrl} 
          alt={name} 
          width={20} 
          height={20} 
          className="rounded-full mr-1.5 object-cover"
        />
      ) : (
        <UserCircleIcon className="h-5 w-5 mr-1.5 text-gray-400 dark:text-neutral-500"/>
      )}
      <span>{name}</span>
    </div>
  );
}

function renderContentSpecificInfo(content: Content, config: ContentDisplayConfig) {
  const items = [];

  switch (content.type) {
    case 'course':
      items.push(
        <div key="lessons" className="flex items-center" title="Jumlah Pelajaran">
          <BookOpenIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <span>{content.lessonsCount} Lessons</span>
        </div>
      );
      if (config.showDuration) {
        items.push(
          <div key="duration" className="flex items-center" title="Total Durasi">
            <ClockIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
            <span>{content.totalDurationHours} Jam</span>
          </div>
        );
      }
      if (config.showProgress && content.progress !== undefined) {
        items.push(
          <div key="progress" className="flex items-center" title="Progress">
            <CheckCircleIcon className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
            <span>{content.progress}% Selesai</span>
          </div>
        );
      }
      break;

    case 'teacher':
      if (content.studentsCount) {
        items.push(
          <div key="students" className="flex items-center" title="Jumlah Siswa">
            <UsersIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span>{content.studentsCount} Siswa</span>
          </div>
        );
      }
      if (content.coursesCount) {
        items.push(
          <div key="courses" className="flex items-center" title="Jumlah Kursus">
            <BookOpenIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
            <span>{content.coursesCount} Kursus</span>
          </div>
        );
      }
      break;

    case 'webinar':
      items.push(
        <div key="schedule" className="flex items-center" title="Jadwal">
          <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <span>{new Date(content.scheduledAt).toLocaleDateString('id-ID')}</span>
        </div>
      );
      items.push(
        <div key="duration" className="flex items-center" title="Durasi">
          <ClockIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
          <span>{content.duration} menit</span>
        </div>
      );
      break;

    case 'news':
      if (content.readTime) {
        items.push(
          <div key="readTime" className="flex items-center" title="Waktu Baca">
            <ClockIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
            <span>{content.readTime} menit baca</span>
          </div>
        );
      }
      items.push(
        <div key="published" className="flex items-center" title="Tanggal Publikasi">
          <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <span>{new Date(content.publishedAt).toLocaleDateString('id-ID')}</span>
        </div>
      );
      break;
  }

  return items;
}

function renderRating(content: Content) {
  if ((content.type === 'course' || content.type === 'teacher') && typeof content.rating === 'number') {
    return (
      <div className="flex items-center text-sm">
        <StarIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-300 mr-1" />
        <span className="font-semibold text-gray-700 dark:text-neutral-200">
          {content.rating.toFixed(1)}
        </span>
        {content.type === 'course' && content.studentsEnrolled && (
          <span className="text-xs text-gray-500 dark:text-neutral-400 ml-1.5">
            ({content.studentsEnrolled})
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="text-xs text-gray-500 dark:text-neutral-400">
      Belum ada rating
    </div>
  );
}

function renderPrice(content: Content) {
  if (content.type === 'course' || content.type === 'webinar') {
    if (typeof content.price === 'number') {
      return (
        <span className="rounded-lg bg-transparent border border-brand-purple dark:border-purple-500 px-3 py-1 text-sm font-medium text-brand-purple dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors">
          ${content.price.toLocaleString('id-ID')}
        </span>
      );
    } else if (content.price === "Gratis") {
      return (
        <span className="text-md font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-700/30 px-2.5 py-1 rounded-md">
          Gratis
        </span>
      );
    }
  }

  if (content.type === 'teacher' && content.hourlyRate) {
    return (
      <span className="rounded-lg bg-transparent border border-brand-purple dark:border-purple-500 px-3 py-1 text-sm font-medium text-brand-purple dark:text-purple-400">
        ${content.hourlyRate}/jam
      </span>
    );
  }

  return null;
} 