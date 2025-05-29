// "use client"; // Tidak perlu jika hanya menampilkan data statis

import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon, VideoCameraIcon, UserCircleIcon, StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"; // Menggunakan solid untuk ikon yang lebih menonjol

export interface TeacherProfile {
  id: string;
  name: string;
  avatarUrl: string | null; // Bisa null jika menggunakan inisial
  expertiseAreas: string[];
  shortBio: string;
  coursesCount: number;
  lessonsCount: number;
  rating?: number;
  isVerified?: boolean;
  profileUrl?: string;
}

interface TeacherDisplayCardProps {
  teacher: TeacherProfile;
}

export function TeacherDisplayCard({ teacher }: TeacherDisplayCardProps) {
  const initials = teacher.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group relative flex flex-col bg-white dark:bg-neutral-800/90 border border-gray-200 dark:border-neutral-700/80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden">
      {/* Background effect on hover (optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-purple-700/20 dark:to-blue-700/20"></div>

      <div className="relative p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-5">
          {teacher.avatarUrl ? (
            <Image
              src={teacher.avatarUrl}
              alt={teacher.name}
              width={72}
              height={72}
              className="rounded-full object-cover shadow-md border-2 border-white dark:border-neutral-700 flex-shrink-0"
              onError={(e) => {
                // Fallback jika gambar gagal dimuat
                const target = e.target as HTMLImageElement;
                target.style.display = 'none'; // Sembunyikan image tag
                // Anda bisa menampilkan div inisial di sini jika mau
              }}
            />
          ) : (
            <div className="w-18 h-18 rounded-full bg-brand-purple text-white flex items-center justify-center text-2xl font-semibold shadow-md flex-shrink-0 border-2 border-white dark:border-neutral-700">
              {initials}
            </div>
          )}
          <div className="ml-4 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-neutral-100 truncate group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">
              {teacher.name}
            </h3>
            {teacher.isVerified && (
                <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 mt-0.5">
                    <CheckBadgeIcon className="h-4 w-4 mr-1" />
                    Pengajar Terverifikasi
                </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          {teacher.expertiseAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {teacher.expertiseAreas.slice(0, 3).map((area, index) => ( // Batasi jumlah tag yang ditampilkan
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
            {teacher.shortBio}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-auto pt-4 border-t border-gray-200 dark:border-neutral-700/60">
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <div>
                <span className="font-semibold">{teacher.coursesCount}</span> Kursus
            </div>
          </div>
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <VideoCameraIcon className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0" />
             <div>
                <span className="font-semibold">{teacher.lessonsCount}</span> Lessons
            </div>
          </div>
          {typeof teacher.rating === 'number' && (
            <div className="flex items-center text-gray-700 dark:text-neutral-300 col-span-2">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                <div>
                    Rating: <span className="font-semibold">{teacher.rating.toFixed(1)}</span> / 5.0
                </div>
            </div>
          )}
        </div>

        {teacher.profileUrl && (
          <Link
            href={teacher.profileUrl}
            className="block mt-6 w-full text-center px-6 py-3 text-sm font-semibold text-white bg-brand-purple rounded-lg shadow-md hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
          >
            Lihat Profil Lengkap
          </Link>
        )}
      </div>
    </div>
  );
}