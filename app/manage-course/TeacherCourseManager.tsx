"use client";

import React, { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherCourse {
  id: string;
  title: string;
  description?: string; // ✅ Made optional
  thumbnailUrl: string;
  instructorName?: string;
  category: string;
  level: string;
  price: number | "Gratis";
  rating?: number;
  studentsEnrolled: number;
  lessonsCount: number;
  totalDurationHours: number;
  isNew: boolean;
  published?: boolean; // ✅ Made optional
  createdAt?: string; // ✅ Made optional since not returned by API
  tags?: string[];
}

interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: number;
  tags: string[];
  published: boolean;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function TeacherCourseManager() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TeacherCourse | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<TeacherCourse | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    category: 'Web Development',
    level: 'Pemula',
    price: 0,
    tags: [],
    published: false
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch teacher's courses
  useEffect(() => {
    if (user && token) {
      fetchTeacherCourses();
    }
  }, [user, token]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: Notification['type'], message: string) => {
    setNotification({ type, message });
  };

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const allCourses = await response.json();
        // Filter courses by current user (instructor)
        const teacherCourses = allCourses.filter((course: TeacherCourse) => 
          course.instructorName === user?.name || course.instructorName === user?.username
        );
        setCourses(teacherCourses);
      } else {
        showNotification('error', 'Gagal memuat data kursus');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('error', 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const courseData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : []
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        await fetchTeacherCourses();
        setShowCreateForm(false);
        resetForm();
        showNotification('success', 'Kursus berhasil dibuat!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal membuat kursus');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      showNotification('error', 'Terjadi kesalahan saat membuat kursus');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      setSubmitting(true);
      const courseData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : []
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        await fetchTeacherCourses();
        setEditingCourse(null);
        resetForm();
        showNotification('success', 'Kursus berhasil diperbarui!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal memperbarui kursus');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      showNotification('error', 'Terjadi kesalahan saat memperbarui kursus');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${deletingCourse.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchTeacherCourses();
        setDeletingCourse(null);
        showNotification('success', 'Kursus berhasil dihapus!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal menghapus kursus');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('error', 'Terjadi kesalahan saat menghapus kursus');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnailUrl: '',
      category: 'Web Development',
      level: 'Pemula',
      price: 0,
      tags: [],
      published: false
    });
    setTagInput('');
    setEditingCourse(null);
  };

  const openEditForm = (course: TeacherCourse) => {
    setFormData({
      title: course.title,
      description: course.description || '', // ✅ Handle undefined
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      level: course.level as 'Pemula' | 'Menengah' | 'Lanjutan',
      price: typeof course.price === 'number' ? course.price : 0,
      tags: course.tags || [],
      published: course.published ?? false // ✅ Handle undefined dengan default false
    });
    setEditingCourse(course);
    setShowCreateForm(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const categories = [
    'Web Development', 'Data Science', 'UI/UX Design', 
    'Digital Marketing', 'Bahasa', 'Manajemen', 'Bisnis'
  ];

  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Only teachers can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-10 p-4 sm:p-6 lg:p-8">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' && <CheckIcon className="h-5 w-5 mr-2" />}
              {notification.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
              Kelola Kursus Anda
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
              Pantau dan kelola semua kursus yang Anda ajarkan dengan mudah. Buat kursus baru dan lacak performa siswa.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-neutral-900 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Buat Kursus Baru
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Total Kursus</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{courses.length}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-700/30 p-3 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Total Siswa</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {courses.reduce((sum, course) => sum + course.studentsEnrolled, 0)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-700/30 p-3 rounded-lg">
              <UsersIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Rata-rata Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {courses.length > 0 
                  ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-700/30 p-3 rounded-lg">
              <StarIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Kursus Terpublikasi</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {courses.filter(course => course.published).length}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-700/30 p-3 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-brand-purple dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpenIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-neutral-200">Belum Ada Kursus</h3>
          <p className="mt-2 text-base text-gray-500 dark:text-neutral-400">
            Mulai dengan membuat kursus pertama Anda dan bagikan pengetahuan dengan dunia.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="mt-6 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-neutral-900"
          >
            Buat Kursus Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {courses.map((course) => (
            <div key={course.id} className="relative flex flex-col bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 overflow-hidden h-full">
              <div className="relative w-full h-48 sm:h-52">
                <SafeImage
                  src={course.thumbnailUrl?.includes('i.pinimg.com') 
                    ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
                    : course.thumbnailUrl
                  }
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out"
                />
                {course.isNew && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    BARU
                  </span>
                )}
                {!course.published && (
                  <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                    DRAFT
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${
                    course.level === "Pemula" ? "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300" :
                    course.level === "Menengah" ? "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300" :
                    course.level === "Lanjutan" ? "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300" :
                    "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300"
                  }`}>
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-1 uppercase tracking-wider">
                  {course.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3 line-clamp-2 flex-grow">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700 dark:text-neutral-300 my-3">
                  <div className="flex items-center" title="Jumlah Siswa">
                    <UsersIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span>{course.studentsEnrolled} Siswa</span>
                  </div>
                  <div className="flex items-center" title="Jumlah Pelajaran">
                    <BookOpenIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span>{course.lessonsCount} Lessons</span>
                  </div>
                  <div className="flex items-center" title="Total Durasi">
                    <ClockIcon className="h-4 w-4 mr-1.5 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                    <span>{course.totalDurationHours} Jam</span>
                  </div>
                  <div className="flex items-center" title="Rating">
                    <StarIcon className="h-4 w-4 mr-1.5 text-yellow-400 dark:text-yellow-300 flex-shrink-0" />
                    <span>{course.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {course.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-200 dark:border-neutral-700/60">
                  <span className="text-lg font-bold text-brand-purple dark:text-purple-400">
                    {typeof course.price === 'number' ? `Rp${course.price.toLocaleString()}` : course.price}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Link
                      href={`/courses/${course.id}`}
                      className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Lihat Kursus"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openEditForm(course)}
                      className="p-2 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Edit Kursus"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Hapus Kursus"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {(showCreateForm || editingCourse) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
              {editingCourse ? 'Edit Kursus' : 'Buat Kursus Baru'}
            </h2>
            
            <form onSubmit={editingCourse ? handleEditCourse : handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Judul Kursus
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  URL Thumbnail
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value as 'Pemula' | 'Menengah' | 'Lanjutan'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                  min="0"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Tambah tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow focus:shadow-lg"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-200 dark:bg-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-brand-purple text-white text-xs rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm text-gray-700 dark:text-neutral-300">
                  Publikasikan langsung
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCourse(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Menyimpan...' : editingCourse ? 'Perbarui Kursus' : 'Buat Kursus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Konfirmasi Hapus</h2>
            </div>
            
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Apakah Anda yakin ingin menghapus kursus <strong>&quot;{deletingCourse.title}&quot;</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletingCourse(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteCourse}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus Kursus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}