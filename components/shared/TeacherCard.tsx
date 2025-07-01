import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UsersIcon, BookOpenIcon, StarIcon } from "@heroicons/react/24/solid";

interface TeacherCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  subject: string;
  studentsCount: number;
  coursesCount: number;
  rating: number;
  hourlyRate?: number;
  bio?: string;
  isOnline?: boolean;
  href?: string;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  name,
  avatarUrl,
  subject,
  studentsCount,
  coursesCount,
  rating,
  hourlyRate,
  bio,
  isOnline = false,
  href = `/teachers/${id}`,
  showStats = true,
  variant = 'default'
}) => {
  const generateAvatarUrl = (name: string) => {
    const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=6B46C1&color=ffffff&bold=true`;
  };

  return (
    <Link href={href} className="group block">
      <div className="bg-white dark:bg-neutral-800/80 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700/70 transform hover:-translate-y-1">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src={avatarUrl || generateAvatarUrl(name)}
              alt={`${name} avatar`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-neutral-700"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-neutral-800 rounded-full"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 font-medium">
                  {subject}
                </p>
              </div>
              
              {hourlyRate && (
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-purple dark:text-purple-400">
                    Rp {hourlyRate.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">per jam</p>
                </div>
              )}
            </div>

            {bio && variant === 'detailed' && (
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 line-clamp-2">
                {bio}
              </p>
            )}

            {showStats && (
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  <span className="text-sm text-gray-600 dark:text-neutral-400">
                    {studentsCount} siswa
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <BookOpenIcon className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  <span className="text-sm text-gray-600 dark:text-neutral-400">
                    {coursesCount} kursus
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-neutral-400">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeacherCard; 