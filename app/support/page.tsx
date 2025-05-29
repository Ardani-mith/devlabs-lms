// 2. app/dashboard/support/page.tsx
// Path: app/dashboard/support/page.tsx

"use client";

import React, { useState, useMemo, Fragment } from 'react';
import Link from 'next/link'; // Pastikan Link diimpor
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  LifebuoyIcon,
  TicketIcon,
  PhoneIcon, // Untuk WhatsApp
  CheckCircleIcon as CheckCircleIconSolid, // Untuk status Berhasil
  XCircleIcon, // Untuk status Gagal
  InformationCircleIcon, // Untuk info
} from '@heroicons/react/24/solid';
import { BookOpenIcon } from '@heroicons/react/24/outline';
// Jika Anda ingin menggunakan Headless UI untuk Accordion (lebih baik untuk aksesibilitas & animasi)
// import { Disclosure, Transition } from '@headlessui/react';


// --- Data Types (Interfaces) ---
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string; // Opsional: untuk mengelompokkan FAQ
  tags?: string[];
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  link?: string; // Link ke bagian FAQ atau halaman khusus
}

// --- Placeholder Data ---
const helpCategoriesData: HelpCategory[] = [
  {
    id: "cat1",
    title: "Panduan Akun & Profil",
    description: "Kelola akun, profil, dan pengaturan notifikasi Anda.",
    icon: AcademicCapIcon,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/60",
    link: "#faq-akun"
  },
  {
    id: "cat2",
    title: "Pembayaran & Langganan",
    description: "Bantuan terkait tagihan, metode pembayaran, dan paket langganan.",
    icon: CreditCardIcon,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/60",
    link: "#faq-pembayaran"
  },
  {
    id: "cat3",
    title: "Penggunaan Kursus",
    description: "Navigasi materi, kuis, tugas, dan forum diskusi kursus.",
    icon: BookOpenIcon, // Mengganti dengan ikon yang lebih relevan
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/60",
    link: "#faq-kursus"
  },
  {
    id: "cat4",
    title: "Masalah Teknis & Login",
    description: "Solusi untuk masalah login, error, atau kendala teknis lainnya.",
    icon: WrenchScrewdriverIcon,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/60",
    link: "#faq-teknis"
  },
];

const faqData: FAQItem[] = [
  // Akun & Profil
  { id: "faq1", category: "Akun & Profil", question: "Bagaimana cara mengubah alamat email saya?", answer: "Anda dapat mengubah alamat email melalui halaman 'Pengaturan Akun' di profil Anda. Pastikan untuk memverifikasi email baru setelah perubahan.", tags: ["email", "akun", "profil"] },
  { id: "faq2", category: "Akun & Profil", question: "Saya lupa password, bagaimana cara meresetnya?", answer: "Pada halaman login, klik tautan 'Lupa Password?'. Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan instruksi untuk mereset password Anda melalui email.", tags: ["password", "login", "reset"] },
  // Pembayaran & Langganan
  { id: "faq3", category: "Pembayaran & Langganan", question: "Metode pembayaran apa saja yang diterima?", answer: "Kami menerima Kartu Kredit/Debit (Visa, Mastercard), Virtual Account, GoPay, OVO, dan transfer bank. Pilihan lengkap akan tersedia saat checkout.", tags: ["pembayaran", "metode", "kartu kredit", "gopay"] },
  { id: "faq4", category: "Pembayaran & Langganan", question: "Bagaimana cara membatalkan langganan saya?", answer: "Anda dapat mengelola langganan Anda melalui halaman 'Pengaturan Akun' > 'Langganan'. Pembatalan akan berlaku efektif pada akhir siklus tagihan saat ini.", tags: ["langganan", "berhenti", "batal"] },
  // Penggunaan Kursus
  { id: "faq5", category: "Penggunaan Kursus", question: "Apakah saya bisa mendapatkan sertifikat setelah menyelesaikan kursus?", answer: "Ya, sebagian besar kursus kami menyediakan sertifikat digital setelah Anda menyelesaikan semua materi dan tugas. Informasi ketersediaan sertifikat ada di halaman detail setiap kursus.", tags: ["sertifikat", "kursus", "lulus"] },
  { id: "faq6", category: "Penggunaan Kursus", question: "Bagaimana cara menghubungi pengajar jika ada pertanyaan terkait materi?", answer: "Setiap kursus memiliki forum diskusi di mana Anda bisa bertanya kepada pengajar atau berdiskusi dengan siswa lain. Beberapa pengajar juga menyediakan sesi Q&A langsung.", tags: ["pengajar", "diskusi", "forum", "materi"] },
  // Teknis & Login
  { id: "faq7", category: "Teknis & Login", question: "Video kursus tidak bisa diputar, apa yang harus saya lakukan?", answer: "Pastikan koneksi internet Anda stabil. Coba bersihkan cache browser Anda atau gunakan browser lain. Jika masalah berlanjut, hubungi tim dukungan kami dengan menyertakan detail browser dan perangkat yang Anda gunakan.", tags: ["video", "error", "teknis", "putar"] },
  { id: "faq8", category: "Teknis & Login", question: "Saya tidak bisa login meskipun password sudah benar.", answer: "Pastikan tidak ada kesalahan ketik dan Caps Lock tidak aktif. Coba bersihkan cookie browser Anda. Jika masih bermasalah, Anda bisa mencoba mereset password Anda atau menghubungi dukungan teknis kami.", tags: ["login", "gagal", "password", "akun"] }
];

// --- Sub-Komponen ---

const FAQAccordionItem = ({ faqItem, defaultOpen = false }: { faqItem: FAQItem, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-neutral-700/80 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-neutral-800 transition-all duration-300 hover:shadow-md">
      <h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-5 sm:p-6 text-left text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple dark:focus-visible:ring-purple-500 transition-colors"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${faqItem.id}`}
        >
          <span className="font-semibold text-sm sm:text-base">{faqItem.question}</span>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 dark:text-neutral-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      {isOpen && (
        <div
          id={`faq-answer-${faqItem.id}`}
          className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-200 dark:border-neutral-700 animate-fadeInDown"
        >
          <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {faqItem.answer}
          </p>
        </div>
      )}
    </div>
  );
};


export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "Dukungan Umum", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const WHATSAPP_NUMBER = "6285647882215"; // Nomor WhatsApp tanpa + atau 0 di depan untuk link wa.me
  const WHATSAPP_MESSAGE = encodeURIComponent("Halo tim dukungan Devlab, saya membutuhkan bantuan terkait...");

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqData; // Tampilkan semua jika search kosong
    const lowerSearchTerm = searchTerm.toLowerCase();
    return faqData.filter(faq =>
      faq.question.toLowerCase().includes(lowerSearchTerm) ||
      faq.answer.toLowerCase().includes(lowerSearchTerm) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Mengirim data dukungan:", contactForm);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.2; // 80% chance of success
    if (success) {
      setSubmitStatus("success");
      setContactForm({ name: "", email: "", subject: "Dukungan Umum", message: "" });
    } else {
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-text-light-primary dark:text-text-dark-primary">
      {/* <section className="relative bg-gradient-to-br from-brand-purple via-purple-600 to-indigo-700 dark:from-purple-800 dark:via-purple-700 dark:to-indigo-800 text-white py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 text-center shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
        </div>
        <div className="relative z-10">
            <LifebuoyIcon className="h-20 w-20 sm:h-24 sm:w-24 text-purple-300 dark:text-purple-400 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-5">
            Pusat Bantuan Devlab
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 dark:text-purple-200 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Butuh bantuan? Kami siap membantu Anda! Jelajahi FAQ kami, temukan panduan, atau hubungi tim dukungan kami untuk solusi cepat.
            </p>
        </div>
      </section> */}

      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-20">
        {/* <section id="search-faq" aria-labelledby="search-faq-heading">
          <div className="max-w-3xl mx-auto relative">
            <label htmlFor="faq-search-input" className="sr-only">Cari Bantuan</label>
            <MagnifyingGlassIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              id="faq-search-input"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik pertanyaan, topik, atau kata kunci (misal: 'password', 'sertifikat')"
              className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 rounded-xl border-2 border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm sm:text-base focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-md transition-all focus:shadow-lg"
            />
          </div>
        </section> */}

        {/* <section id="help-categories" aria-labelledby="help-categories-heading">
          <h2 id="help-categories-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-10 text-center tracking-tight">
            Jelajahi Kategori Bantuan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {helpCategoriesData.map((category) => (
              <Link href={category.link || "#support-faq"} key={category.id} className="group block">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-gray-200 dark:border-neutral-700/70 h-full flex flex-col items-center text-center hover:border-brand-purple/50 dark:hover:border-purple-500/50">
                  <div className={`p-5 rounded-full ${category.bgColor} mb-5 inline-flex group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <category.icon className={`h-10 w-10 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-2 group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 flex-grow leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section> */}

        {/* <section id="support-faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-10 text-center tracking-tight">
            Pertanyaan Umum (FAQ)
          </h2>
          {filteredFaqs.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-5">
              {filteredFaqs.map((faq, index) => (
                <FAQAccordionItem key={faq.id} faqItem={faq} defaultOpen={index === 0 && !!searchTerm} /> // Buka item pertama jika ada hasil search
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-neutral-800/80 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700/70">
              <QuestionMarkCircleIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-neutral-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Tidak Ada Hasil</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                Maaf, tidak ada FAQ yang cocok dengan kata kunci "{searchTerm}". Coba kata kunci lain.
              </p>
            </div>
          )}
        </section> */}

        <section id="contact-support" aria-labelledby="contact-support-heading">
          <div className="bg-white dark:bg-neutral-800/80 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="md:pr-8">
                <TicketIcon className="h-12 w-12 text-brand-purple dark:text-purple-400 mb-4"/>
                <h2 id="contact-support-heading" className="text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-3 tracking-tight">
                  Perlu Bantuan Lebih Lanjut?
                </h2>
                <p className="text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed">
                  Tim dukungan kami siap membantu Anda dengan pertanyaan atau masalah apa pun yang mungkin Anda hadapi. Isi formulir di samping atau hubungi kami melalui WhatsApp.
                </p>
                <div className="space-y-3 text-sm text-gray-700 dark:text-neutral-300">
                    <p className="flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2.5 text-gray-500 dark:text-neutral-400 flex-shrink-0" />
                        Jam Operasional: Senin - Jumat, 08:00 - 17:00 WIB
                    </p>
                    <p className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 mr-2.5 text-gray-500 dark:text-neutral-400 flex-shrink-0" />
                        Email: support@devlab.com (Respon dalam 24 jam kerja)
                    </p>
                </div>
                 <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                >
                    <PhoneIcon className="h-5 w-5 mr-2" /> Chat via WhatsApp
                </a>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5 bg-gray-50 dark:bg-neutral-700/50 p-6 sm:p-8 rounded-xl shadow-inner">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" name="name" id="name" value={contactForm.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1.5">Alamat Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" id="email" value={contactForm.email} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1.5">Subjek <span className="text-red-500">*</span></label>
                  <input type="text" name="subject" id="subject" value={contactForm.subject} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1.5">Pesan Anda <span className="text-red-500">*</span></label>
                  <textarea name="message" id="message" rows={5} value={contactForm.message} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm min-h-[120px]" />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <ClockIcon className="animate-spin h-5 w-5 mr-2" /> Mengirim...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45" /> Kirim Tiket Dukungan
                      </>
                    )}
                  </button>
                </div>
                {submitStatus === "success" && (
                  <div className="p-3 rounded-md bg-green-100 dark:bg-green-700/40 text-green-700 dark:text-green-200 text-sm flex items-center shadow">
                    <CheckCircleIconSolid className="h-5 w-5 mr-2 flex-shrink-0"/> Pesan Anda telah berhasil terkirim. Tim kami akan segera menghubungi Anda.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-3 rounded-md bg-red-100 dark:bg-red-700/40 text-red-700 dark:text-red-200 text-sm flex items-center shadow">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0"/> Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
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
