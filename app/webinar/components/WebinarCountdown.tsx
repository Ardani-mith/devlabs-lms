// 4. app/dashboard/webinar/components/WebinarCountdown.tsx
// Path: app/dashboard/webinar/components/WebinarCountdown.tsx

"use client";
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface WebinarCountdownProps {
  targetDate: string;
  onZero?: () => void;
}

export function WebinarCountdown({ targetDate, onZero }: WebinarCountdownProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        if (onZero) onZero();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!isClient) {
    return <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>;
  }
  
  const timerComponents = [];
  if (timeLeft.days > 0) timerComponents.push(<span key="d" className="font-bold">{timeLeft.days}H</span>);
  if (timeLeft.hours > 0 || timeLeft.days > 0) timerComponents.push(<span key="h" className="font-bold">{timeLeft.hours}J</span>);
  if (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0) timerComponents.push(<span key="m" className="font-bold">{timeLeft.minutes}M</span>);
  timerComponents.push(<span key="s" className="font-bold">{timeLeft.seconds}D</span>);

  const isPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && +new Date(targetDate) < +new Date();

  if (isPast) {
    return <span className="text-sm font-medium text-red-500 dark:text-red-400">Waktu Habis</span>;
  }

  return (
    <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-800/50 px-2.5 py-1 rounded-md">
      <Clock className="h-4 w-4" />
      <span>Mulai dalam:</span>
      {timerComponents.map((component, index) => (
        <React.Fragment key={index}>
          {component}
          {index < timerComponents.length - 1 && <span className="opacity-50">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}