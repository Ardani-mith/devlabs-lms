import Image from "next/image";
import Link from "next/link";
import {
  BookOpenIcon, // General course icon
  ClockIcon,    // For duration
  UserCircleIcon, // For instructor
  ChartBarIcon, // For level
  StarIcon,     // For rating
  TagIcon,      // For category
  SparklesIcon, // For new/featured
  CurrencyDollarIcon // For price
} from "@heroicons/react/24/solid";

export interface CourseDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatarUrl?: string; // Optional
  category: string;
  lessonsCount: number;
  totalDurationHours: number;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  rating?: number;
  studentsEnrolled?: number;
  price?: number | "Gratis";
  courseUrl: string;
  isNew?: boolean;
  tags?: string[];
}

interface CourseDisplayCardProps {
  course: CourseDetails;
}

export function CourseDisplayCard({ course }: CourseDisplayCardProps) {
  const levelColor =
    course.level === "Pemula" ? "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300" :
    course.level === "Menengah" ? "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300" :
    course.level === "Lanjutan" ? "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300" :
    "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300";

  return (
    <Link href={course.courseUrl} className="group block">
      <div className="relative flex flex-col bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 overflow-hidden h-full">
        <div className="relative w-full h-48 sm:h-52">
          <Image
            src={course.thumbnailUrl || "https://i.pinimg.com/736x/67/d8/3c/67d83c1fb9aab00ec58e0a9820bbb70c.jpg"} // Fallback image
            alt={course.title}
            layout="fill"
            className="object-cover group-hover:scale-100 transition-transform duration-500 ease-in-out"
          />
          {course.isNew && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              BARU
            </span>
          )}
           <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColor} shadow-sm`}>
              {course.level}
            </span>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-1 uppercase tracking-wider">
            {course.category}
          </span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center text-xs text-gray-600 dark:text-neutral-400 mb-3">
            {course.instructorAvatarUrl ? (
              <Image src={course.instructorAvatarUrl} alt={course.instructorName} width={20} height={20} className="rounded-full mr-1.5 object-cover"/>
            ) : (
              <UserCircleIcon className="h-5 w-5 mr-1.5 text-gray-400 dark:text-neutral-500"/>
            )}
            <span>{course.instructorName}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700 dark:text-neutral-300 my-3">
            <div className="flex items-center" title="Jumlah Pelajaran">
              <BookOpenIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span>{course.lessonsCount} Lessons</span>
            </div>
            <div className="flex items-center" title="Total Durasi">
              <ClockIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span>{course.totalDurationHours} Jam</span>
            </div>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 my-2">
              {course.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 rounded-full">{tag}</span>
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-200 dark:border-neutral-700/60">
            {typeof course.rating === 'number' ? (
              <div className="flex items-center text-sm">
                <StarIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-300 mr-1" />
                <span className="font-semibold text-gray-700 dark:text-neutral-200">{course.rating.toFixed(1)}</span>
                {course.studentsEnrolled && <span className="text-xs text-gray-500 dark:text-neutral-400 ml-1.5">({course.studentsEnrolled})</span>}
              </div>
            ) : (
                <div className="text-xs text-gray-500 dark:text-neutral-400">Belum ada rating</div>
            )}

            {typeof course.price === 'number' ? (
              <span className="rounded-lg bg-transparent border border-brand-purple dark:border-purple-500 px-3 py-1 text-sm font-medium text-brand-purple dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors">
                $ {course.price.toLocaleString('id-ID')}
              </span>
            ) : course.price === "Gratis" ? (
              <span className="text-md font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-700/30 px-2.5 py-1 rounded-md">
                Gratis
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
