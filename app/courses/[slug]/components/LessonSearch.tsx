"use client";

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { VideoCameraIcon, DocumentTextIcon, QuestionMarkCircleIcon, PresentationChartLineIcon, SparklesIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { Lesson } from '@/lib/types';

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface LessonSearchProps {
  modules: Module[];
  onLessonSelect: (lesson: Lesson) => void;
  activeLesson: Lesson | null;
}

export default function LessonSearch({ modules, onLessonSelect, activeLesson }: LessonSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allLessons = useMemo(() => {
    return modules.flatMap(module => 
      module.lessons.map(lesson => ({
        ...lesson,
        moduleName: module.title
      }))
    );
  }, [modules]);

  const filteredLessons = useMemo(() => {
    return allLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.moduleName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || lesson.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || lesson.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allLessons, searchQuery, selectedType, selectedStatus]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return VideoCameraIcon;
      case 'bacaan': return DocumentTextIcon;
      case 'kuis': return QuestionMarkCircleIcon;
      case 'tugas': return PresentationChartLineIcon;
      case 'interaktif': return SparklesIcon;
      default: return BookOpenIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai': return 'text-green-500';
      case 'sedang_dipelajari': return 'text-blue-500';
      case 'selanjutnya': return 'text-gray-500';
      case 'terkunci': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari materi pembelajaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors ${
            isFilterOpen ? 'text-purple-400 bg-purple-900/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-neutral-200">Filter Materi</h3>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Reset Filter
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Tipe Materi</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 text-sm"
              >
                <option value="all">Semua Tipe</option>
                <option value="video">Video</option>
                <option value="bacaan">Bacaan</option>
                <option value="kuis">Kuis</option>
                <option value="tugas">Tugas</option>
                <option value="interaktif">Interaktif</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="selesai">Selesai</option>
                <option value="sedang_dipelajari">Sedang Dipelajari</option>
                <option value="selanjutnya">Selanjutnya</option>
                <option value="terkunci">Terkunci</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-neutral-400">
          <span>{filteredLessons.length} materi ditemukan</span>
          {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredLessons.map((lesson) => {
            const IconComponent = getLessonIcon(lesson.type);
            const isActive = activeLesson?.id === lesson.id;
            
            return (
              <button
                key={lesson.id}
                onClick={() => onLessonSelect(lesson)}
                disabled={lesson.status === 'terkunci'}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-900/50 border-purple-500 text-white'
                    : lesson.status === 'terkunci'
                    ? 'bg-neutral-800/50 border-neutral-700 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isActive ? 'text-purple-300' : getStatusColor(lesson.status)
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{lesson.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-neutral-500">{lesson.moduleName}</span>
                      {lesson.durationMinutes && (
                        <span className="text-xs text-neutral-500">{lesson.durationMinutes} mnt</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 