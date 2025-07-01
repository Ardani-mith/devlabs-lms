import React from 'react';
import Link from 'next/link';
import { StatCardData } from '@/lib/types';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface StatCardProps extends StatCardData {
  showDetailButton?: boolean;
  detailButtonText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  href,
  showDetailButton = true,
  detailButtonText = 'Lihat Detail',
}) => {
  const CardContent = () => (
    <div className={`p-6 rounded-[14px] ${bgColor} h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-semibold text-text-light-secondary dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className={`p-1.5 rounded-full ${bgColor.replace('bg-', 'bg-').replace('/50', '/70')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        <p className="text-4xl font-bold text-text-light-primary dark:text-neutral-50">
          {value}
        </p>
      </div>
      
      {showDetailButton && (
        <div className="mt-4">
          {href ? (
            <Link 
              href={href}
              className={`text-xs ${color} font-semibold flex items-center group transition-all duration-300 hover:opacity-80`}
            >
              {detailButtonText}
              <ChevronRightIcon className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          ) : (
            <button className={`text-xs ${color} font-semibold flex items-center group transition-all duration-300 hover:opacity-80`}>
              {detailButtonText}
              <ChevronRightIcon className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <BackgroundGradient 
      className="rounded-2xl p-0.5 bg-white dark:bg-neutral-800/80 h-full" 
      containerClassName="h-full"
    >
      <CardContent />
    </BackgroundGradient>
  );
};

export default StatCard; 