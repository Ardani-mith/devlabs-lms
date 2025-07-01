import { ComponentType } from 'react';

export interface KPIData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export interface CourseAnalytics {
  id: number;
  name: string;
  students: number;
  revenue: string;
  rating: number;
}

export interface DemographicData {
  region: string;
  percentage: number;
  color: string;
}

export interface TeacherPerformance {
  avgRating: number;
  coursesTaught: number;
  totalStudents: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface ChartConfig {
  title: string;
  type: 'Line' | 'Bar' | 'Doughnut' | 'Area';
  data?: ChartDataPoint[];
  height?: number;
}

export interface AnalyticsFilterConfig {
  showDateFilter: boolean;
  showExportButton: boolean;
  showTeacherFilter: boolean;
  defaultPeriod: string;
  availablePeriods: string[];
}

export interface AnalyticsPageConfig {
  showKPIs: boolean;
  showCharts: boolean;
  showPopularCourses: boolean;
  showDemographics: boolean;
  showTeacherPerformance: boolean;
  filters: AnalyticsFilterConfig;
  layout: {
    kpiColumns: number;
    chartColumns: number;
    tableColumns: number;
  };
}

export interface AnalyticsData {
  kpis: KPIData[];
  popularCourses: CourseAnalytics[];
  demographics: DemographicData[];
  teacherPerformance: TeacherPerformance;
  charts: {
    enrollmentTrend: ChartDataPoint[];
    revenueGrowth: ChartDataPoint[];
  };
}

export interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedPeriod: string;
  selectedTeacher: string;
  isExporting: boolean;
} 