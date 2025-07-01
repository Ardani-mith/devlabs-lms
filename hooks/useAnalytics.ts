import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UsersIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import {
  AnalyticsData,
  AnalyticsState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  KPIData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CourseAnalytics,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DemographicData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TeacherPerformance,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ChartDataPoint
} from '../app/analytics/types/analytics';

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  kpis: [
    {
      title: "Total Students",
      value: "1,879",
      change: "+12.5%",
      changeType: "positive",
      icon: UsersIcon,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      title: "Active Courses",
      value: "124",
      change: "+5",
      changeType: "positive",
      icon: BookOpenIcon,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
    },
    {
      title: "Total Revenue",
      value: "$48,620",
      change: "+8.2%",
      changeType: "positive",
      icon: CurrencyDollarIcon,
      color: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      title: "Avg. Completion Rate",
      value: "76%",
      change: "-1.8%",
      changeType: "negative",
      icon: AcademicCapIcon,
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/30",
    },
  ],
  popularCourses: [
    { id: 1, name: "Advanced JavaScript & React Mastery", students: 302, revenue: "$8,990", rating: 4.8 },
    { id: 2, name: "Python for Data Science Bootcamp", students: 258, revenue: "$7,500", rating: 4.7 },
    { id: 3, name: "UX Design Fundamentals: From Zero to Hero", students: 210, revenue: "$6,100", rating: 4.9 },
    { id: 4, name: "Digital Marketing Strategy for Growth", students: 180, revenue: "$5,500", rating: 4.6 },
    { id: 5, name: "The Complete Shopify Dropshipping Course", students: 155, revenue: "$4,200", rating: 4.5 },
  ],
  demographics: [
    { region: "Asia", percentage: 40, color: "bg-blue-500" },
    { region: "Europe", percentage: 30, color: "bg-green-500" },
    { region: "Americas", percentage: 20, color: "bg-indigo-500" },
    { region: "Others", percentage: 10, color: "bg-red-500" },
  ],
  teacherPerformance: {
    avgRating: 4.7,
    coursesTaught: 12,
    totalStudents: 350,
  },
  charts: {
    enrollmentTrend: [
      { label: "Jan", value: 120, date: "2024-01" },
      { label: "Feb", value: 150, date: "2024-02" },
      { label: "Mar", value: 180, date: "2024-03" },
      { label: "Apr", value: 200, date: "2024-04" },
    ],
    revenueGrowth: [
      { label: "Q1", value: 15000, date: "2024-Q1" },
      { label: "Q2", value: 20000, date: "2024-Q2" },
      { label: "Q3", value: 25000, date: "2024-Q3" },
      { label: "Q4", value: 30000, date: "2024-Q4" },
    ],
  },
};

export const useAnalytics = () => {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    loading: true,
    error: null,
    selectedPeriod: 'Last 30 Days',
    selectedTeacher: 'All Teachers',
    isExporting: false,
  });

  // Simulate data fetching
  const fetchAnalyticsData = useCallback(async (_period: string, _teacher: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an actual API call
      // const response = await fetch(`/api/analytics?period=${period}&teacher=${teacher}`);
      // const data = await response.json();
      
      setState(prev => ({
        ...prev,
        data: mockAnalyticsData,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
      }));
    }
  }, []);

  // Handle period change
  const handlePeriodChange = useCallback((period: string) => {
    setState(prev => ({ ...prev, selectedPeriod: period }));
    fetchAnalyticsData(period, state.selectedTeacher);
  }, [fetchAnalyticsData, state.selectedTeacher]);

  // Handle teacher change
  const handleTeacherChange = useCallback((teacher: string) => {
    setState(prev => ({ ...prev, selectedTeacher: teacher }));
    fetchAnalyticsData(state.selectedPeriod, teacher);
  }, [fetchAnalyticsData, state.selectedPeriod]);

  // Handle export
  const handleExport = useCallback(async () => {
    setState(prev => ({ ...prev, isExporting: true }));
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would trigger download
      console.log('Exporting analytics report...');
      
      setState(prev => ({ ...prev, isExporting: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isExporting: false,
        error: 'Failed to export report',
      }));
    }
  }, []);

  // Computed values
  const computedData = useMemo(() => {
    if (!state.data) return null;

    return {
      ...state.data,
      totalStudents: state.data.kpis[0]?.value || '0',
      totalRevenue: state.data.kpis[2]?.value || '$0',
      topCourse: state.data.popularCourses[0] || null,
      avgRating: state.data.teacherPerformance.avgRating,
    };
  }, [state.data]);

  // Initialize data on mount
  useEffect(() => {
    fetchAnalyticsData(state.selectedPeriod, state.selectedTeacher);
  }, []);

  return {
    ...state,
    computedData,
    actions: {
      handlePeriodChange,
      handleTeacherChange,
      handleExport,
      refetch: () => fetchAnalyticsData(state.selectedPeriod, state.selectedTeacher),
    },
  };
}; 