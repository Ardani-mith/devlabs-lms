"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface EnrolledCourse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  course: {
    id: number;
    title: string;
    thumbnailUrl: string;
    category: string;
    level: string;
    instructor: {
      name: string;
      username: string;
    };
  };
}

export default function MyEnrolledCourses() {
  const { user, token } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    if (user && token) {
      fetchEnrolledCourses();
    }
  }, [user, token]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/my-courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = enrolledCourses.filter(enrollment => {
    switch (filter) {
      case 'in-progress':
        return !enrollment.completed && enrollment.progress > 0;
      case 'completed':
        return enrollment.completed;
      default:
        return true;
    }
  });

  const getProgressColor = (progress: number, completed: boolean) => {
    if (completed) return 'bg-green-500';
    if (progress > 70) return 'bg-blue-500';
    if (progress > 30) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusBadge = (progress: number, completed: boolean) => {
    if (completed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Selesai
        </span>
      );
    }
    if (progress > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <PlayIcon className="w-3 h-3 mr-1" />
          Sedang Belajar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        <BookOpenIcon className="w-3 h-3 mr-1" />
        Belum Dimulai
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (!user || user.role === 'TEACHER') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">This page is for students only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kursus Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Lanjutkan pembelajaran Anda dan pantau progress
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Cari Kursus Baru
        </Link>
      </div>

      {/* Stats Overview */}
      {enrolledCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Kursus</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrolledCourses.length}</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sedang Belajar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrolledCourses.filter(e => !e.completed && e.progress > 0).length}
                </p>
              </div>
              <PlayIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrolledCourses.filter(e => e.completed).length}
                </p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrolledCourses.length > 0 
                    ? Math.round(enrolledCourses.reduce((sum, e) => sum + e.progress, 0) / enrolledCourses.length)
                    : 0
                  }%
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {enrolledCourses.length > 0 && (
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Semua ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'in-progress'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sedang Belajar ({enrolledCourses.filter(e => !e.completed && e.progress > 0).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Selesai ({enrolledCourses.filter(e => e.completed).length})
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          {enrolledCourses.length === 0 ? (
            <>
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Kursus</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Anda belum mendaftar ke kursus manapun. Mulai pembelajaran Anda sekarang!
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Jelajahi Kursus
              </Link>
            </>
          ) : (
            <>
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tidak Ada Kursus {filter === 'in-progress' ? 'Sedang Belajar' : 'Selesai'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'in-progress' 
                  ? 'Mulai belajar salah satu kursus Anda.'
                  : 'Belum ada kursus yang selesai.'
                }
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((enrollment) => (
            <div key={enrollment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={enrollment.course.thumbnailUrl}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(enrollment.progress, enrollment.completed)}
                </div>
                {enrollment.completed && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 rounded-full p-2">
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress, enrollment.completed)}`}
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="font-medium">Kategori:</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {enrollment.course.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Level:</span>
                    <span className="ml-2">{enrollment.course.level}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Instruktur:</span>
                    <span className="ml-2">{enrollment.course.instructor.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Terdaftar: {formatDate(enrollment.enrolledAt)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/courses/${enrollment.course.id}`}
                    className="flex-1 text-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {enrollment.progress === 0 ? 'Mulai Belajar' : 'Lanjutkan'}
                  </Link>
                  {enrollment.completed && (
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Sertifikat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 