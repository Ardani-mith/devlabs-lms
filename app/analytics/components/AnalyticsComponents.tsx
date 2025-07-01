"use client";

import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  StarIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { KPIData, CourseAnalytics, DemographicData, TeacherPerformance, ChartConfig } from '../types/analytics';

// Header Component
interface AnalyticsHeaderProps {
  selectedPeriod: string;
  isExporting: boolean;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedPeriod,
  isExporting,
  onPeriodChange,
  onExport
}) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
        Analytics Dashboard
      </h1>
      <p className="text-base text-gray-600 dark:text-neutral-400 mt-1">
        Welcome back! Here&apos;s your platform overview.
      </p>
    </div>
    <div className="flex items-center space-x-3">
      <button 
        onClick={() => onPeriodChange(selectedPeriod)}
        className="flex items-center bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm font-medium text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors"
      >
        <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
        <span>{selectedPeriod}</span>
        <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-400 dark:text-neutral-500" />
      </button>
      <button 
        onClick={onExport}
        disabled={isExporting}
        className="flex items-center bg-brand-purple text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        <DocumentTextIcon className="h-5 w-5 mr-2" />
        {isExporting ? 'Exporting...' : 'Export Report'}
      </button>
    </div>
  </div>
);

// KPI Grid Component
interface KPIGridProps {
  kpis: KPIData[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {kpis.map((kpi, index) => (
      <BackgroundGradient key={index} className="rounded-[22px] p-0.5 bg-white dark:bg-neutral-800">
        <div className={`p-6 rounded-[20px] ${kpi.bgColor} h-full`}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wider">
              {kpi.title}
            </h3>
            <div className={`p-2 rounded-full ${
              kpi.bgColor === 'bg-blue-50 dark:bg-blue-900/30' ? 'bg-blue-100 dark:bg-blue-800' : 
              kpi.bgColor === 'bg-green-50 dark:bg-green-900/30' ? 'bg-green-100 dark:bg-green-800' : 
              kpi.bgColor === 'bg-indigo-50 dark:bg-indigo-900/30' ? 'bg-indigo-100 dark:bg-indigo-800' : 
              'bg-red-100 dark:bg-red-800'
            }`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-text-light-primary dark:text-text-dark-primary">
            {kpi.value}
          </p>
          <div className="flex items-center mt-1 text-xs">
            <span
              className={`flex items-center font-medium ${
                kpi.changeType === "positive"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {kpi.changeType === "positive" ? (
                <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />
              )}
              {kpi.change}
            </span>
            <span className="ml-1 text-text-light-secondary dark:text-text-dark-secondary">vs last period</span>
          </div>
        </div>
      </BackgroundGradient>
    ))}
  </div>
);

// Chart Placeholder Component
interface ChartPlaceholderProps {
  config: ChartConfig;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ config }) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg h-80 flex flex-col">
    <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
      {config.title}
    </h3>
    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md">
      <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
        {config.type} Chart Placeholder
      </p>
    </div>
  </div>
);

// Popular Courses Table Component
interface PopularCoursesTableProps {
  courses: CourseAnalytics[];
}

export const PopularCoursesTable: React.FC<PopularCoursesTableProps> = ({ courses }) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
        Most Popular Courses
      </h3>
      <button className="text-sm text-brand-purple dark:text-purple-400 font-medium hover:underline">
        View All Courses
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="border-b border-gray-200 dark:border-neutral-700">
          <tr>
            <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary">
              Course Name
            </th>
            <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-center">
              Students
            </th>
            <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-right">
              Revenue
            </th>
            <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-center">
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr 
              key={course.id} 
              className="border-b border-gray-100 dark:border-neutral-700/50 hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors"
            >
              <td className="py-3.5 px-4 text-text-light-primary dark:text-text-dark-primary font-medium">
                {course.name}
              </td>
              <td className="py-3.5 px-4 text-text-light-secondary dark:text-text-dark-secondary text-center">
                {course.students}
              </td>
              <td className="py-3.5 px-4 text-text-light-secondary dark:text-text-dark-secondary text-right">
                {course.revenue}
              </td>
              <td className="py-3.5 px-4 text-text-light-secondary dark:text-text-dark-secondary text-center">
                <span className="flex items-center justify-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {course.rating.toFixed(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Demographics Component
interface DemographicsProps {
  demographics: DemographicData[];
}

export const Demographics: React.FC<DemographicsProps> = ({ demographics }) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
      Student Demographics
    </h3>
    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md h-64">
      <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
        Doughnut Chart Placeholder
      </p>
    </div>
    <div className="mt-4 space-y-2">
      {demographics.map((demo, index) => (
        <div key={index} className="flex justify-between text-xs">
          <span className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${demo.color} mr-2`}></span>
            {demo.region}
          </span>
          <span>{demo.percentage}%</span>
        </div>
      ))}
    </div>
  </div>
);

// Teacher Performance Component
interface TeacherPerformanceProps {
  performance: TeacherPerformance;
  selectedTeacher: string;
  onTeacherChange: (teacher: string) => void;
}

export const TeacherPerformanceSection: React.FC<TeacherPerformanceProps> = ({
  performance,
  selectedTeacher,
  onTeacherChange
}) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
        Teacher Performance
      </h3>
      <div className="flex items-center space-x-2 mt-3 md:mt-0">
        <select 
          value={selectedTeacher}
          onChange={(e) => onTeacherChange(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 py-2 px-3 text-sm focus:ring-brand-purple focus:border-brand-purple"
        >
          <option>All Teachers</option>
          <option>Carole Towne</option>
          <option>Ralph Legros</option>
        </select>
        <button className="p-2 text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Avg. Rating</p>
        <p className="text-2xl font-semibold mt-1">
          {performance.avgRating} <span className="text-yellow-400">★</span>
        </p>
      </div>
      <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Courses Taught</p>
        <p className="text-2xl font-semibold mt-1">{performance.coursesTaught}</p>
      </div>
      <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Total Students</p>
        <p className="text-2xl font-semibold mt-1">{performance.totalStudents}+</p>
      </div>
    </div>
  </div>
); 