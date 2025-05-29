import { ReactNode } from "react";
// Anda bisa menggunakan "Card" dari Aceternity atau membuat custom.

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string; // e.g., "+12%"
  changeType?: "positive" | "negative";
}

export function StatsCard({ title, value, icon, change, changeType }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-card-bg-light dark:bg-card-bg-dark p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
          {title}
        </p>
        <div className="text-brand-purple dark:text-purple-400">{icon}</div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold text-text-light-primary dark:text-text-dark-primary">
          {value}
        </p>
        {change && (
          <p className={`mt-1 text-xs ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}