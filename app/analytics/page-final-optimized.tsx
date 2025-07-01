"use client";

import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  AnalyticsHeader,
  KPIGrid,
  ChartPlaceholder,
  PopularCoursesTable,
  Demographics,
  TeacherPerformanceSection
} from './components/AnalyticsComponents';
import { AnalyticsPageConfig } from './types/analytics';

// Configuration for different analytics views
const ANALYTICS_CONFIGURATIONS = {
  default: {
    showKPIs: true,
    showCharts: true,
    showPopularCourses: true,
    showDemographics: true,
    showTeacherPerformance: true,
    filters: {
      showDateFilter: true,
      showExportButton: true,
      showTeacherFilter: true,
      defaultPeriod: 'Last 30 Days',
      availablePeriods: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year'],
    },
    layout: {
      kpiColumns: 4,
      chartColumns: 2,
      tableColumns: 3,
    },
  },
  minimal: {
    showKPIs: true,
    showCharts: false,
    showPopularCourses: true,
    showDemographics: false,
    showTeacherPerformance: false,
    filters: {
      showDateFilter: false,
      showExportButton: true,
      showTeacherFilter: false,
      defaultPeriod: 'Last 30 Days',
      availablePeriods: ['Last 30 Days'],
    },
    layout: {
      kpiColumns: 4,
      chartColumns: 1,
      tableColumns: 1,
    },
  },
  comprehensive: {
    showKPIs: true,
    showCharts: true,
    showPopularCourses: true,
    showDemographics: true,
    showTeacherPerformance: true,
    filters: {
      showDateFilter: true,
      showExportButton: true,
      showTeacherFilter: true,
      defaultPeriod: 'Last 30 Days',
      availablePeriods: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year', 'Custom'],
    },
    layout: {
      kpiColumns: 4,
      chartColumns: 2,
      tableColumns: 3,
    },
  },
} as const;

interface AnalyticsPageProps {
  config?: keyof typeof ANALYTICS_CONFIGURATIONS;
  customConfig?: Partial<AnalyticsPageConfig>;
}

export default function AnalyticsFinalOptimized({ 
  config = 'default',
  customConfig 
}: AnalyticsPageProps = {}) {
  // Get configuration with defaults
  const pageConfig = customConfig || ANALYTICS_CONFIGURATIONS[config];
  const layout = pageConfig.layout || { kpiColumns: 4, chartColumns: 2, tableColumns: 3 };
  
  const {
    data,
    loading,
    error,
    selectedPeriod,
    selectedTeacher,
    isExporting,
    actions
  } = useAnalytics();

  // Render loading state
  const renderLoadingState = () => (
    <div className="space-y-8 p-4 md:p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
      </div>
      
             {pageConfig.showKPIs && (
         <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-${layout.kpiColumns}`}>
           {[...Array(layout.kpiColumns)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}

      {pageConfig.showCharts && (
        <div className={`grid grid-cols-1 lg:grid-cols-${layout.chartColumns} gap-6`}>
          {[...Array(layout.chartColumns)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}
    </div>
  );

  // Render error state
  const renderErrorState = () => (
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

  // Render no data state
  const renderNoDataState = () => (
    <div className="space-y-8 p-4 md:p-8">
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg font-medium">No Analytics Data Available</div>
        <p className="text-gray-600 dark:text-neutral-400">Please check back later.</p>
      </div>
    </div>
  );

  // Early returns for different states
  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!data) return renderNoDataState();

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
      {pageConfig.showKPIs && data.kpis && (
        <KPIGrid kpis={data.kpis} />
      )}

      {/* Charts Section */}
      {pageConfig.showCharts && (
        <div className={`grid grid-cols-1 lg:grid-cols-${layout.chartColumns} gap-6`}>
          <ChartPlaceholder 
            config={{
              title: "Student Enrollment Trend",
              type: "Line",
              data: data.charts.enrollmentTrend,
            }} 
          />
          <ChartPlaceholder 
            config={{
              title: "Revenue Growth",
              type: "Bar",
              data: data.charts.revenueGrowth,
            }} 
          />
        </div>
      )}

      {/* Table and Demographics Section */}
      <div className={`grid grid-cols-1 lg:grid-cols-${layout.tableColumns} gap-6`}>
        {/* Popular Courses Table */}
        {pageConfig.showPopularCourses && data.popularCourses && (
          <div className="lg:col-span-2">
            <PopularCoursesTable courses={data.popularCourses} />
          </div>
        )}

        {/* Demographics */}
        {pageConfig.showDemographics && data.demographics && (
          <Demographics demographics={data.demographics} />
        )}
      </div>

      {/* Teacher Performance Section */}
      {pageConfig.showTeacherPerformance && data.teacherPerformance && (
        <TeacherPerformanceSection
          performance={data.teacherPerformance}
          selectedTeacher={selectedTeacher}
          onTeacherChange={actions.handleTeacherChange}
        />
      )}

      {/* Configuration Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Current Configuration: {config}
          </h4>
          <pre className="text-xs text-gray-600 dark:text-neutral-400 overflow-auto">
            {JSON.stringify(pageConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Example usage demonstrations:
export const AnalyticsDefault = () => <AnalyticsFinalOptimized config="default" />;
export const AnalyticsMinimal = () => <AnalyticsFinalOptimized config="minimal" />;
export const AnalyticsComprehensive = () => <AnalyticsFinalOptimized config="comprehensive" />;

// Custom configuration example
export const AnalyticsCustom = () => (
  <AnalyticsFinalOptimized 
    customConfig={{
      showKPIs: true,
      showCharts: false,
      showPopularCourses: true,
      showDemographics: false,
      showTeacherPerformance: true,
      filters: {
        showDateFilter: true,
        showExportButton: false,
        showTeacherFilter: true,
        defaultPeriod: 'Last 7 Days',
        availablePeriods: ['Last 7 Days', 'Last 30 Days'],
      },
      layout: {
        kpiColumns: 2,
        chartColumns: 1,
        tableColumns: 2,
      },
    }}
  />
); 