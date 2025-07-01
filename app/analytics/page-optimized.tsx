"use client";

import React, { useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  AnalyticsHeader,
  KPIGrid,
  ChartPlaceholder,
  PopularCoursesTable,
  Demographics,
  TeacherPerformanceSection
} from './components/AnalyticsComponents';
import { ChartConfig } from './types/analytics';

// Configuration for the analytics page
const analyticsConfig = {
  charts: {
    enrollmentTrend: {
      title: "Student Enrollment Trend",
      type: "Line" as const,
      height: 320,
    },
    revenueGrowth: {
      title: "Revenue Growth",
      type: "Bar" as const,
      height: 320,
    },
  },
  layout: {
    showKPIs: true,
    showCharts: true,
    showPopularCourses: true,
    showDemographics: true,
    showTeacherPerformance: true,
  },
};

export default function AnalyticsPageOptimized() {
  const {
    data,
    loading,
    error,
    selectedPeriod,
    selectedTeacher,
    isExporting,
    actions
  } = useAnalytics();

  // Memoized chart configurations
  const chartConfigs = useMemo((): ChartConfig[] => [
    {
      ...analyticsConfig.charts.enrollmentTrend,
      data: data?.charts.enrollmentTrend || [],
    },
    {
      ...analyticsConfig.charts.revenueGrowth,
      data: data?.charts.revenueGrowth || [],
    },
  ], [data]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Analytics</div>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">{error}</p>
          <button
            onClick={actions.refetch}
            className="bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg font-medium">No Analytics Data Available</div>
          <p className="text-gray-600 dark:text-neutral-400">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header Section */}
      <AnalyticsHeader
        selectedPeriod={selectedPeriod}
        isExporting={isExporting}
        onPeriodChange={actions.handlePeriodChange}
        onExport={actions.handleExport}
      />

      {/* KPI Section */}
      {analyticsConfig.layout.showKPIs && data.kpis && (
        <KPIGrid kpis={data.kpis} />
      )}

      {/* Charts Section */}
      {analyticsConfig.layout.showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartConfigs.map((config, index) => (
            <ChartPlaceholder key={index} config={config} />
          ))}
        </div>
      )}

      {/* Table and Demographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Courses Table */}
        {analyticsConfig.layout.showPopularCourses && data.popularCourses && (
          <div className="lg:col-span-2">
            <PopularCoursesTable courses={data.popularCourses} />
          </div>
        )}

        {/* Demographics */}
        {analyticsConfig.layout.showDemographics && data.demographics && (
          <Demographics demographics={data.demographics} />
        )}
      </div>

      {/* Teacher Performance Section */}
      {analyticsConfig.layout.showTeacherPerformance && data.teacherPerformance && (
        <TeacherPerformanceSection
          performance={data.teacherPerformance}
          selectedTeacher={selectedTeacher}
          onTeacherChange={actions.handleTeacherChange}
        />
      )}
    </div>
  );
} 