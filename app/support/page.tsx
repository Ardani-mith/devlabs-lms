// 2. app/dashboard/support/page.tsx
// Path: app/dashboard/support/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// TypeScript Types
interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  link: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportData {
  categories: HelpCategory[];
  faqs: FAQ[];
}

interface APICategoryData {
  id: string;
  title: string;
  description: string;
  iconType: string;
  color: string;
  bgColor: string;
  link: string;
}

interface APISupportResponse {
  categories: APICategoryData[];
  faqs: FAQ[];
}

// API function to fetch support data
const fetchSupportData = async (): Promise<SupportData> => {
  try {
    // TODO: Replace with real API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/support`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch support data: ${response.status}`);
    }

    const data: APISupportResponse = await response.json();
      
    // Map icons for categories
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'account': AcademicCapIcon,
      'payment': CreditCardIcon,
      'course': BookOpenIcon,
      'technical': WrenchScrewdriverIcon,
    };

    const categoriesWithIcons = data.categories.map((cat: APICategoryData) => ({
      ...cat,
      icon: iconMap[cat.iconType] || QuestionMarkCircleIcon
    }));

    return {
      categories: categoriesWithIcons,
      faqs: data.faqs || []
    };
  } catch (error) {
    console.error('Support API error:', error);
    return {
      categories: [],
      faqs: []
    };
  }
};

export default function SupportPage() {
  const [supportData, setSupportData] = useState<SupportData>({
    categories: [],
    faqs: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        setLoading(true);
        const data = await fetchSupportData();
        setSupportData(data);
      } catch (error) {
        console.error('Error loading support data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSupportData();
  }, []);

  const { categories, faqs } = supportData;

  // Filter FAQs based on search query and selected category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pusat Bantuan & Dukungan
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto lg:mx-0">
          Temukan jawaban untuk pertanyaan Anda atau hubungi tim dukungan kami untuk bantuan lebih lanjut.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
          <input
            type="search"
            placeholder="Ketik pertanyaan, topik, atau kata kunci (misal: 'password', 'sertifikat')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-brand-purple focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Help Categories */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  selectedCategory === category.id
                    ? 'border-brand-purple bg-brand-purple/5 dark:bg-brand-purple/10'
                    : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-brand-purple/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center mb-4`}>
                  <IconComponent className={`h-6 w-6 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  {category.description}
                </p>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-neutral-500 mt-3" />
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              Lihat Semua
            </button>
          )}
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600 overflow-hidden"
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors list-none">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-neutral-400 group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada FAQ ditemukan
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Coba gunakan kata kunci lain atau hubungi tim dukungan kami.
            </p>
          </div>
        )}
      </div>

      {/* Contact Support Section */}
      <div className="bg-gradient-to-r from-brand-purple to-purple-700 p-8 rounded-2xl text-white text-center">
        <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">Masih Butuh Bantuan?</h3>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Tim dukungan kami siap membantu Anda 24/7. Hubungi kami melalui chat langsung atau email.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-brand-purple hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
            Chat Langsung
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-brand-purple px-8 py-3 rounded-lg font-semibold transition-colors">
            Kirim Email
          </button>
        </div>
      </div>
    </div>
  );
}

// Tambahkan ke globals.css jika belum ada untuk animasi accordion:
/*
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInDown {
  animation: fadeInDown 0.3s ease-out forwards;
}
*/
