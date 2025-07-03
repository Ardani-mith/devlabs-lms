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

// Create default analytics data structure with icons
const createDefaultAnalyticsData = (): AnalyticsData => ({
  kpis: [
    {
      title: "Total Students",
      value: "0",
      change: "0%",
      changeType: "positive",
      icon: UsersIcon,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      title: "Active Courses",
      value: "0",
      change: "0",
      changeType: "positive",
      icon: BookOpenIcon,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: "0%",
      changeType: "positive",
      icon: CurrencyDollarIcon,
      color: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      title: "Avg. Completion Rate",
      value: "0%",
      change: "0%",
      changeType: "positive",
      icon: AcademicCapIcon,
      color: "text-yellow-500 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
    },
  ],
  popularCourses: [],
  demographics: [],
  teacherPerformance: {
    avgRating: 0,
    coursesTaught: 0,
    totalStudents: 0,
  },
  charts: {
    enrollmentTrend: [],
    revenueGrowth: [],
  },
});

export const useAnalytics = () => {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    loading: true,
    error: null,
    selectedPeriod: 'Last 30 Days',
    selectedTeacher: 'All Teachers',
    isExporting: false,
  });

  // Fetch real analytics data from API
  const fetchAnalyticsData = useCallback(async (period: string, teacher: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Make real API call to get analytics data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/analytics?period=${period}&teacher=${teacher}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const apiData = await response.json();
        
        // Transform API data to match AnalyticsData structure
        const transformedData: AnalyticsData = {
          ...createDefaultAnalyticsData(),
          ...apiData,
        };
        
        setState(prev => ({
          ...prev,
          data: transformedData,
          loading: false,
        }));
      } else {
        // If API fails, use default data
        setState(prev => ({
          ...prev,
          data: createDefaultAnalyticsData(),
          loading: false,
        }));
      }
    } catch (err) {
      console.error('Analytics API error:', err);
      setState(prev => ({
        ...prev,
        data: createDefaultAnalyticsData(),
        loading: false,
        error: 'Failed to fetch analytics data',
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
      // Make API call to export analytics report
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/analytics/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: state.selectedPeriod,
          teacher: state.selectedTeacher,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics-report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      setState(prev => ({ ...prev, isExporting: false }));
    } catch (err) {
      console.error('Export error:', err);
      setState(prev => ({
        ...prev,
        isExporting: false,
        error: 'Failed to export report',
      }));
    }
  }, [state.selectedPeriod, state.selectedTeacher]);

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