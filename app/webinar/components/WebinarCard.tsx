// 5. app/dashboard/webinar/components/WebinarCard.tsx
// Path: app/dashboard/webinar/components/WebinarCard.tsx

"use client";
import Image from 'next/image';
import { WebinarStatusBadge } from './WebinarStatusBadge';
import { WebinarCountdown } from './WebinarCountdown';
import { Users, CalendarDays, Clock, PlayCircle, Download, ArrowRight, CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Speaker { name: string; title: string; avatarUrl?: string; }
type WebinarStatus = "LIVE" | "UPCOMING" | "ENDED";
interface Webinar {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  thumbnailUrl: string;
  speakers: Speaker[];
  dateTime: string;
  durationMinutes: number;
  status: WebinarStatus;
  joinUrl?: string;
  replayUrl?: string;
  materialsUrl?: { name: string; url: string }[];
}

interface WebinarCardProps {
  webinar: Webinar;
}

export function WebinarCard({ webinar }: WebinarCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const eventDate = new Date(webinar.dateTime);

  const handleStatusChangeToLive = () => {
    console.log(`Webinar ${webinar.title} is now LIVE!`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group bg-white dark:bg-neutral-800/80 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 dark:border-neutral-700/70 transition-all duration-300 ease-in-out transform hover:-translate-y-2 overflow-hidden flex flex-col h-full"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 
                    bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 
                    dark:from-purple-600/20 dark:via-transparent dark:to-blue-600/20`}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="relative w-full h-52 sm:h-56 overflow-hidden">
          <Image
            src={webinar.thumbnailUrl || "https://placehold.co/600x400/2d3748/e2e8f0?text=Webinar"}
            alt={webinar.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <WebinarStatusBadge status={webinar.status} />
          </div>
           {webinar.status === 'UPCOMING' && (
            <div className="absolute bottom-3 left-3 right-3">
                 <WebinarCountdown targetDate={webinar.dateTime} onZero={handleStatusChangeToLive} />
            </div>
           )}
        </div>

        <div className="p-5 sm:p-6 flex-grow flex flex-col">
          <p className="text-xs font-semibold text-brand-purple dark:text-purple-400 mb-1 uppercase tracking-wider">
            {webinar.category}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">
            {webinar.title}
          </h3>
          {webinar.tagline && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400 mb-3 line-clamp-2">
              {webinar.tagline}
            </p>
          )}

          <div className="text-xs text-gray-500 dark:text-neutral-400 space-y-1.5 mb-4">
            <div className="flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>{eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB • {webinar.durationMinutes} Menit</span>
            </div>
            {webinar.speakers.length > 0 && (
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span>Pembicara: {webinar.speakers.map(s => s.name).join(', ')}</span>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-neutral-700/60">
            {webinar.status === "LIVE" && webinar.joinUrl && (
              <Link href={webinar.joinUrl} target="_blank" className="w-full group/button flex items-center justify-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                <PlayCircle className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                Gabung Sekarang (LIVE)
              </Link>
            )}
            {webinar.status === "UPCOMING" && webinar.joinUrl && (
              <Link href={webinar.joinUrl} className="w-full group/button flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                <CalendarCheck className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                Daftar / Ingatkan Saya
              </Link>
            )}
            {webinar.status === "ENDED" && (
              <div className="flex flex-col sm:flex-row gap-2">
                {webinar.replayUrl && (
                  <Link href={webinar.replayUrl} className="flex-1 group/button flex items-center justify-center px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                    <PlayCircle className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                    Tonton Rekaman
                  </Link>
                )}
                {webinar.materialsUrl && webinar.materialsUrl.length > 0 && (
                  <Link href={webinar.materialsUrl[0].url} target="_blank" className="flex-1 group/button flex items-center justify-center px-5 py-2.5 bg-transparent border-2 border-brand-purple text-brand-purple hover:bg-brand-purple/10 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-500/20 font-semibold text-sm rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                    <Download className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                    Unduh Materi
                  </Link>
                )}
              </div>
            )}
             {!webinar.joinUrl && !webinar.replayUrl && webinar.status !== "ENDED" && (
                 <Link href={`/dashboard/webinar/${webinar.slug}`} className="w-full group/button flex items-center justify-center px-5 py-2.5 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-700 dark:text-neutral-200 font-semibold text-sm rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                    Lihat Detail <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}