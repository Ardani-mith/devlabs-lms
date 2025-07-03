"use client";

import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

// YouTube Components
import {
  YouTubeThumbnailUpload,
  YouTubeUrlInput,
  RoleGuard
} from './components/YouTubeComponents';

// Use the API-integrated hook
import { useCourseManagementAPI } from '@/hooks/useCourseManagementAPI';

// Import shared components from existing optimized page
import {
  CourseStatsGrid,
  NotificationBanner,
  CourseManagementHeader,
  CourseCard,
  EmptyState,
  DeleteConfirmation
} from './components/CourseManagementComponents';

// Enhanced Course Form with YouTube Integration and Real API
const YouTubeCourseForm: React.FC<{
  mode: 'create' | 'edit';
  formData: any;
  tagInput: string;
  submitting: boolean;
  uploadingThumbnail: boolean;
  thumbnailPreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFormDataChange: (updates: any) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onThumbnailUpload: (file: File) => void;
  onThumbnailRemove: () => void;
  onYouTubeUrlChange: (url: string, videoId: string) => void;
  onYouTubeVideoInfo: (info: any) => void;
}> = ({
  mode,
  formData,
  tagInput,
  submitting,
  uploadingThumbnail,
  thumbnailPreview,
  onSubmit,
  onCancel,
  onFormDataChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onThumbnailUpload,
  onThumbnailRemove,
  onYouTubeUrlChange,
  onYouTubeVideoInfo
}) => {
  const categories = ['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Mobile Development'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
          {mode === 'edit' ? 'Edit Kursus YouTube' : 'Buat Kursus YouTube Baru'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* YouTube URL Input */}
          <YouTubeUrlInput
            value={formData.youtubeEmbedUrl}
            onChange={onYouTubeUrlChange}
            onVideoInfo={onYouTubeVideoInfo}
          />

          {/* YouTube Thumbnail Upload */}
          <YouTubeThumbnailUpload
            currentThumbnail={formData.youtubeThumbnailUrl}
            onFileSelect={onThumbnailUpload}
            onRemove={onThumbnailRemove}
            uploading={uploadingThumbnail}
            preview={thumbnailPreview}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Judul Kursus *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onFormDataChange({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                required
                placeholder="Masukkan judul kursus"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Deskripsi *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              rows={3}
              required
              placeholder="Jelaskan tentang kursus Anda"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => onFormDataChange({ level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjutan">Lanjutan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => onFormDataChange({ price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Durasi (Jam)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.totalDurationHours}
                onChange={(e) => onFormDataChange({ totalDurationHours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                min="0.5"
                placeholder="1"
              />
            </div>
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
                onChange={(e) => onTagInputChange(e.target.value)}
                placeholder="Tambah tag (contoh: JavaScript, React)"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600/80 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
              />
              <button
                type="button"
                onClick={onAddTag}
                className="px-3 py-2 bg-gray-200 dark:bg-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-brand-purple text-white text-xs rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 text-white hover:text-gray-200"
                  >
                    ×
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
              onChange={(e) => onFormDataChange({ published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm text-gray-700 dark:text-neutral-300">
              Publikasikan langsung
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingThumbnail}
              className="flex-1 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Perbarui Kursus' : 'Buat Kursus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component with Real API Integration
export default function APIIntegratedCourseManagement() {
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
    uploadingThumbnail,
    thumbnailPreview,
    
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
    
    // YouTube functionality
    uploadYouTubeThumbnail,
    processYouTubeUrl,
    handleYouTubeVideoInfo,
    removeThumbnailPreview,
  } = useCourseManagementAPI();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCourse();
  };

  const handleDeleteConfirm = async () => {
    await deleteCourse();
  };

  return (
    <RoleGuard allowedRoles={config.allowedRoles} userRole={user?.role}>
      <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
        {/* Notification */}
        {notification && (
          <NotificationBanner
            notification={notification}
            onClose={hideNotification}
          />
        )}

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
                Kelola Kursus YouTube
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
                Buat dan kelola kursus dengan konten YouTube. Data akan tersimpan ke database secara real-time.
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Kursus YouTube
            </button>
          </div>
        </header>

        {/* Stats */}
        {config.enableStats && <CourseStatsGrid stats={stats} />}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
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
        ) : (
          <EmptyState onCreateClick={openCreateForm} />
        )}

        {/* Course Form Modal */}
        {(showCreateForm || editingCourse) && (
          <YouTubeCourseForm
            mode={editingCourse ? 'edit' : 'create'}
            formData={formData}
            tagInput={tagInput}
            submitting={submitting}
            uploadingThumbnail={uploadingThumbnail}
            thumbnailPreview={thumbnailPreview}
            onSubmit={editingCourse ? handleEditSubmit : handleCreateSubmit}
            onCancel={closeEditForm}
            onFormDataChange={updateFormData}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onThumbnailUpload={uploadYouTubeThumbnail}
            onThumbnailRemove={removeThumbnailPreview}
            onYouTubeUrlChange={processYouTubeUrl}
            onYouTubeVideoInfo={handleYouTubeVideoInfo}
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
    </RoleGuard>
  );
} 