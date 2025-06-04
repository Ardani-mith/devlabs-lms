// 8. app/dashboard/settings/components/IntegrationSettings.tsx
// Path: app/dashboard/settings/components/IntegrationSettings.tsx
"use client";
import React, { useState } from 'react';
import { PuzzlePieceIcon as PageIcon, LinkIcon, CheckCircleIcon, CogIcon, ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/solid';
// Asumsikan AceternityButton sudah diimpor atau didefinisikan
const AceternityButton = ({ children, onClick, variant = "primary", className, type = "button", disabled }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 flex items-center justify-center
      ${variant === 'primary' ? 'bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white focus:ring-purple-500' :
        variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-neutral-100 focus:ring-gray-400' :
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      } ${className}`}
  >
    {children}
  </button>
);

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isConnected: boolean;
  connectUrl?: string;
}

const GoogleIcon = () => <svg viewBox="0 0 24 24" className="h-8 w-8"><path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2.18 12.19,2.18C6.42,2.18 2.03,6.8 2.03,12C2.03,17.05 6.16,21.82 12.19,21.82C18.05,21.82 22,17.63 22,11.63C22,11.29 21.35,11.1 21.35,11.1V11.1Z"/></svg>;
const MicrosoftIcon = () => <svg viewBox="0 0 24 24" className="h-8 w-8"><path fill="#F25022" d="M11.4,11.4H0V0H11.4V11.4Z"/><path fill="#7FBA00" d="M24,11.4H12.6V0H24V11.4Z"/><path fill="#00A4EF" d="M11.4,24H0V12.6H11.4V24Z"/><path fill="#FFB900" d="M24,24H12.6V12.6H24V24Z"/></svg>;
const SlackIcon = () => <svg viewBox="0 0 128 128" className="h-8 w-8"><path fill="#36C5F0" d="M62.2 25.9c0-5.6-4.6-10.2-10.2-10.2S41.8 20.3 41.8 25.9v10.2H31.6V25.9C31.6 14.7 40.4 6 52 6s20.4 8.7 20.4 19.9v10.2H62.2V25.9z"/><path fill="#2EB67D" d="M102.1 62.2c5.6 0 10.2-4.6 10.2-10.2S107.7 41.8 102.1 41.8h-10.2v10.2h10.2v10.2c0 11.2-8.7 20.4-19.9 20.4S52 73.4 52 62.2h-10.2v10.2h10.2c0 5.6 4.6 10.2 10.2 10.2s10.2-4.6 10.2-10.2V62.2h10.1z"/><path fill="#ECB22E" d="M65.8 102.1c0 5.6 4.6 10.2 10.2 10.2s10.2-4.6 10.2-10.2V91.9h10.2v10.2c0 11.2-8.7 20.4-19.9 20.4S56 113.3 56 102.1V91.9h10.2v10.2z"/><path fill="#E01E5A" d="M25.9 65.8c-5.6 0-10.2 4.6-10.2 10.2S20.3 86.2 25.9 86.2h10.2V76H25.9V65.8c0-11.2 8.7-20.4 19.9-20.4S66 54.6 66 65.8v10.2H55.8V65.8c0-5.6-4.6-10.2-10.2-10.2S35.4 60.2 35.4 65.8h-9.5z"/></svg>;


export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "google", name: "Akun Google", description: "Login cepat, sinkronisasi Google Calendar, dan akses Google Drive.", icon: GoogleIcon, isConnected: true, connectUrl: "#" },
    { id: "microsoft", name: "Akun Microsoft", description: "Login dengan akun Microsoft dan sinkronkan kalender Outlook.", icon: MicrosoftIcon, isConnected: false, connectUrl: "#" },
    { id: "slack", name: "Slack", description: "Dapatkan notifikasi kursus dan aktivitas langsung di channel Slack Anda.", icon: SlackIcon, isConnected: false, connectUrl: "#" },
  ]);
  const [webhookUrl, setWebhookUrl] = useState("https://api.skillzone.com/webhook/u123xyz/course-updates");
  const [apiKey, setApiKey] = useState("sk_live_xxxxxxxxxxxxxxTESTxxxxxx");

  const handleToggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(int => int.id === id ? { ...int, isConnected: !int.isConnected } : int));
    alert(`Simulasi: Koneksi untuk ${id} ${integrations.find(i=>i.id===id)?.isConnected ? 'diputuskan' : 'dihubungkan'}.`);
  };
  
  const handleGenerateApiKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "NEW";
    setApiKey(newKey);
    alert("Simulasi: API Key baru telah dibuat.");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
        alert(`${type} berhasil disalin ke clipboard!`);
    }).catch(err => {
        alert(`Gagal menyalin ${type}.`);
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-1">Integrasi Aplikasi</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Hubungkan akun Anda dengan layanan pihak ketiga dan kelola webhook untuk otomatisasi.</p>
      </div>

      <section className="pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-6">Akun Terhubung</h3>
        <div className="space-y-6">
          {integrations.map(integration => (
            <div key={integration.id} className="p-6 rounded-xl border border-gray-200 dark:border-neutral-600/80 bg-gray-50 dark:bg-neutral-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-white dark:bg-neutral-600 rounded-full shadow-inner mr-4">
                    <integration.icon />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-neutral-100">{integration.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-md">{integration.description}</p>
                </div>
              </div>
              <AceternityButton
                onClick={() => integration.isConnected ? handleToggleConnection(integration.id) : window.open(integration.connectUrl, '_blank')}
                variant={integration.isConnected ? "secondary" : "primary"}
                className="w-full sm:w-auto flex-shrink-0 py-2"
              >
                {integration.isConnected ? <><XMarkIcon className="h-4 w-4 mr-1.5"/>Putuskan</> : <><LinkIcon className="h-4 w-4 mr-1.5"/>Hubungkan</>}
              </AceternityButton>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">Webhook & API (Untuk Developer)</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Integrasikan LMS dengan sistem Anda menggunakan webhook dan API Key.</p>
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-neutral-700/60 rounded-xl border border-gray-200 dark:border-neutral-600/80">
            <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">URL Endpoint Webhook Anda</label>
                <div className="flex items-center">
                    <input id="webhookUrl" type="text" readOnly value={webhookUrl} className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-700 text-sm text-gray-500 dark:text-neutral-400 cursor-not-allowed focus:outline-none" />
                    <button onClick={() => copyToClipboard(webhookUrl, 'URL Webhook')} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-gray-700 dark:text-neutral-200 rounded-r-lg border border-l-0 border-gray-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"><ClipboardDocumentIcon className="h-5 w-5"/></button>
                </div>
                 <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5">Gunakan URL ini untuk menerima notifikasi event kursus secara real-time dari LMS.</p>
            </div>
            <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">API Key Anda</label>
                 <div className="flex items-center">
                    <input id="apiKey" type="password" readOnly value={apiKey} className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-700 text-sm text-gray-500 dark:text-neutral-400 cursor-not-allowed focus:outline-none" />
                    <button onClick={() => copyToClipboard(apiKey, 'API Key')} className="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-gray-700 dark:text-neutral-200 rounded-r-lg border border-l-0 border-gray-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple"><ClipboardDocumentIcon className="h-5 w-5"/></button>
                </div>
                 <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5">Jaga kerahasiaan API Key Anda. Gunakan untuk otentikasi permintaan ke API LMS.</p>
            </div>
            <div className="flex justify-start">
                <AceternityButton onClick={handleGenerateApiKey} variant="secondary" className="py-2">
                    <CogIcon className="h-4 w-4 mr-2"/> Buat Ulang API Key
                </AceternityButton>
            </div>
        </div>
      </section>
    </div>
  );
}