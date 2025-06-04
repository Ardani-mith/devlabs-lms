// 3. app/dashboard/webinar/components/WebinarStatusBadge.tsx
// Path: app/dashboard/webinar/components/WebinarStatusBadge.tsx

"use client";
import { Zap, CalendarCheck, CheckCircle } from 'lucide-react';

type WebinarStatus = "LIVE" | "UPCOMING" | "ENDED";

interface WebinarStatusBadgeProps {
  status: WebinarStatus;
  className?: string;
}

export function WebinarStatusBadge({ status, className }: WebinarStatusBadgeProps) {
  let bgColor = "";
  let textColor = "";
  let Icon = Zap;

  switch (status) {
    case "LIVE":
      bgColor = "bg-red-500/20 dark:bg-red-400/30";
      textColor = "text-red-600 dark:text-red-300";
      Icon = Zap;
      break;
    case "UPCOMING":
      bgColor = "bg-blue-500/20 dark:bg-blue-400/30";
      textColor = "text-blue-600 dark:text-blue-300";
      Icon = CalendarCheck;
      break;
    case "ENDED":
      bgColor = "bg-gray-500/20 dark:bg-gray-400/30";
      textColor = "text-gray-600 dark:text-gray-300";
      Icon = CheckCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} ${textColor} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
      {status}
    </span>
  );
}