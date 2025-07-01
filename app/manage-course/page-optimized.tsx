"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseManagement } from '@/hooks/useCourseManagement';
// LoadingSpinner component will be created inline for now
import {
  CourseStatsGrid,
  NotificationBanner,
  CourseManagementHeader,
  CourseCard,
  EmptyState,
  CourseForm,
  DeleteConfirmation
} from './components';

export default function CourseManagementOptimized() {
  const { user } = useAuth();
  const {
    // State
    courses,
    loading,
    submitting,
    showCreateForm,
    editingCourse,
    deletingCourse,
    notification,
    formData,
    tagInput,
    stats,
    config,
    
    // Actions
    createCourse,
    updateCourse,
    deleteCourse,
    
    // Form management
    openCreateForm,
    openEditForm,
    closeEditForm,
    updateFormData,
    
    // Tag management
    setTagInput,
    addTag,
    removeTag,
    
    // UI management
    setDeletingCourse,
    hideNotification,
  } = useCourseManagement();

  // Access control
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Only teachers can access this page.</p>
      </div>
    );
  }

  // Loading state
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

  // Form submission handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse(formData);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCourse) {
      await deleteCourse(deletingCourse.id);
    }
  };

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Notification */}
      {notification && (
        <NotificationBanner
          notification={notification}
          onClose={hideNotification}
        />
      )}

      {/* Header */}
      <CourseManagementHeader onCreateClick={openCreateForm} />

      {/* Statistics Grid */}
      {config.enableStats && <CourseStatsGrid stats={stats} />}

      {/* Course Grid */}
      {courses.length === 0 ? (
        <EmptyState onCreateClick={openCreateForm} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={openEditForm}
              onDelete={setDeletingCourse}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingCourse) && (
        <CourseForm
          mode={editingCourse ? 'edit' : 'create'}
          formData={formData}
          tagInput={tagInput}
          submitting={submitting}
          categories={config.categories}
          onSubmit={editingCourse ? handleEditSubmit : handleCreateSubmit}
          onCancel={closeEditForm}
          onFormDataChange={updateFormData}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <DeleteConfirmation
          course={deletingCourse}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCourse(null)}
        />
      )}
    </div>
  );
} 