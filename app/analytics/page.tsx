// app/dashboard/analytics/page.tsx
"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  UsersIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  StarIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { BackgroundGradient } from "@/components/ui/background-gradient"; // Asumsi komponen dari Aceternity UI

// Placeholder untuk komponen chart (nantinya diganti dengan library chart)
const ChartPlaceholder = ({ title, type = "Line" }: { title: string, type?: string }) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg h-80 flex flex-col">
    <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">{title}</h3>
    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md">
      <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">{type} Chart Placeholder</p>
    </div>
  </div>
);

// Data KPI Placeholder
const kpiData = [
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
];

// Data Tabel Placeholder
const popularCoursesData = [
  { id: 1, name: "Advanced JavaScript & React Mastery", students: 302, revenue: "$8,990", rating: 4.8 },
  { id: 2, name: "Python for Data Science Bootcamp", students: 258, revenue: "$7,500", rating: 4.7 },
  { id: 3, name: "UX Design Fundamentals: From Zero to Hero", students: 210, revenue: "$6,100", rating: 4.9 },
  { id: 4, name: "Digital Marketing Strategy for Growth", students: 180, revenue: "$5,500", rating: 4.6 },
  { id: 5, name: "The Complete Shopify Dropshipping Course", students: 155, revenue: "$4,200", rating: 4.5 },
];


export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header Halaman & Filter Utama */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
            Analytics Dashboard
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
            Welcome back! Here's your platform overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm font-medium text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
            <span>Last 30 Days</span>
            <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-400 dark:text-neutral-500" />
          </button>
          <button className="flex items-center bg-brand-purple text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-purple-700 transition-colors">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Baris KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <BackgroundGradient key={index} className="rounded-[22px] p-0.5 bg-white dark:bg-neutral-800">
            <div className={`p-6 rounded-[20px] ${kpi.bgColor} h-full`}>
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                  {kpi.title}
                </h3>
                <div className={`p-2 rounded-full ${kpi.bgColor === 'bg-blue-50 dark:bg-blue-900/30' ? 'bg-blue-100 dark:bg-blue-800' : kpi.bgColor === 'bg-green-50 dark:bg-green-900/30' ? 'bg-green-100 dark:bg-green-800' : kpi.bgColor === 'bg-indigo-50 dark:bg-indigo-900/30' ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-red-100 dark:bg-red-800'}`}>
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

      {/* Baris Grafik Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Student Enrollment Trend" type="Line"/>
        <ChartPlaceholder title="Revenue Growth" type="Bar"/>
      </div>

      {/* Seksi Tabel dan Grafik Sekunder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">Most Popular Courses</h3>
                <button className="text-sm text-brand-purple dark:text-purple-400 font-medium hover:underline">View All Courses</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="border-b border-gray-200 dark:border-neutral-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary">Course Name</th>
                    <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-center">Students</th>
                    <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-right">Revenue</th>
                    <th className="py-3 px-4 font-semibold text-text-light-secondary dark:text-text-dark-secondary text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {popularCoursesData.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100 dark:border-neutral-700/50 hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                      <td className="py-3.5 px-4 text-text-light-primary dark:text-text-dark-primary font-medium">{course.name}</td>
                      <td className="py-3.5 px-4 text-text-light-secondary dark:text-text-dark-secondary text-center">{course.students}</td>
                      <td className="py-3.5 px-4 text-text-light-secondary dark:text-text-dark-secondary text-right">{course.revenue}</td>
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
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">Student Demographics</h3>
          <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md h-64"> {/* Adjusted height */}
             <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Doughnut Chart Placeholder</p>
          </div>
           <div className="mt-4 space-y-2">
            {/* Legend atau data singkat */}
            <div className="flex justify-between text-xs">
              <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>Asia</span>
              <span>40%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>Europe</span>
              <span>30%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>Americas</span>
              <span>20%</span>
            </div>
             <div className="flex justify-between text-xs">
              <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>Others</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>

       {/* Seksi Tambahan atau Filter Lanjutan */}
       <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">Teacher Performance</h3>
             <div className="flex items-center space-x-2 mt-3 md:mt-0">
                <select className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 py-2 px-3 text-sm focus:ring-brand-purple focus:border-brand-purple">
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
            {/* Placeholder untuk statistik per guru atau chart kecil */}
            <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Avg. Rating</p>
                <p className="text-2xl font-semibold mt-1">4.7 <span className="text-yellow-400">★</span></p>
            </div>
             <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Courses Taught</p>
                <p className="text-2xl font-semibold mt-1">12</p>
            </div>
             <div className="border border-gray-200 dark:border-neutral-700 p-4 rounded-lg">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Total Students</p>
                <p className="text-2xl font-semibold mt-1">350+</p>
            </div>
          </div>
        </div>

    </div>
  );
}