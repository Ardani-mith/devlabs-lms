// app/dashboard/messages/page.tsx
"use client"; // Karena akan ada interaksi (meskipun contoh ini statis)

import Image from "next/image";
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline"; // atau solid jika preferensi
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"; // Untuk opsi tambahan jika perlu

// Data Placeholder (ganti dengan data asli dari API Anda)
const contacts = [
  {
    id: 1,
    name: "Jenny Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2d2?w=400&h=400&fit=crop&crop=face", // Ganti dengan path avatar yang benar
    lastMessage: "Hello, Cynthia! Your lesson request...",
    time: "Just now",
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: "Dominick Romaguera",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    lastMessage: "Hey Jenny, I'll prepare some to...",
    time: "10min ago",
    unread: 5,
    online: false,
  },
  {
    id: 3,
    name: "Dolores Raynor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    lastMessage: "Already done! ✅ Btw I was loo...",
    time: "27min ago",
    unread: 3,
    online: true,
  },
  {
    id: 4,
    name: "Felicia Dencik",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    lastMessage: "Is it module 1, right? Cause I've...",
    time: "2hr ago",
    unread: 0,
    online: false,
  },
  // ... tambahkan kontak lain
];

const selectedContact = contacts[0]; // Anggap Jenny Wilson yang terpilih

const messages = [
  {
    id: "sys1",
    type: "system",
    text: "Hey, Cynthia! 👋 You've sent a booking request to Jenny. Soon she will get in contact with you.",
    time: "Friday 2:20pm",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face", // logo sistem atau avatar khusus
  },
  {
    id: "jenny1",
    type: "received",
    name: "Jenny Wilson",
    avatar: selectedContact.avatar,
    text: "Hello, Cynthia! Your lesson request has been accepted. Waiting for our meeting 👋",
    time: "Friday 2:21pm",
  },
  {
    id: "user1",
    type: "sent",
    text: "Hello Jenny! Looking forward to talk to you!",
    time: "Friday 2:20pm", // Seharusnya setelah pesan Jenny, ini hanya contoh
  },
];

const bookingDetails = {
  date: "08/04/2024",
  time: "13:30-14:30",
};

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] text-text-light-primary dark:text-text-dark-primary"> {/* Sesuaikan tinggi jika header memiliki tinggi berbeda */}
      {/* Kolom Daftar Kontak (Chat Sidebar) */}
      <div className="w-1/3 max-w-sm border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h1 className="text-2xl font-semibold">Chat</h1>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
            Messages <span className="text-brand-purple dark:text-purple-400 font-medium">+ {contacts.reduce((sum, c) => sum + c.unread, 0)} new messages</span>
          </p>
          <div className="relative mt-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
            <input
              type="search"
              placeholder="Search messages"
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 py-2.5 pl-10 pr-4 text-sm focus:ring-brand-purple focus:border-brand-purple dark:focus:ring-purple-500 dark:focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-4 border-b border-gray-200 dark:border-neutral-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700/50 ${
                contact.id === selectedContact.id ? "bg-purple-50 dark:bg-purple-900/30" : ""
              }`}
            >
              <div className="relative mr-4">
                <Image
                  src={contact.avatar || "/images/default-avatar.png"} // Fallback avatar
                  alt={contact.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-800"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate text-sm">{contact.name}</h3>
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">{contact.time}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary truncate pr-2">
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="flex-shrink-0 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Area Chat Utama */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-neutral-900/70"> {/* Warna background chat area */}
        {/* Header Chat */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="flex items-center">
            <Image
              src={selectedContact.avatar || "/images/default-avatar.png"}
              alt={selectedContact.name}
              width={40}
              height={40}
              className="rounded-full mr-3 object-cover"
            />
            <div>
              <h2 className="font-semibold text-base">{selectedContact.name}</h2>
              <p className={`text-xs ${selectedContact.online ? "text-green-500" : "text-gray-400"}`}>
                {selectedContact.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 text-brand-purple dark:text-purple-400">
              <PhoneIcon className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-purple text-white hover:bg-purple-700 transition-colors">
              View profile
            </button>
            {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            </button> */}
          </div>
        </div>

        {/* Area Pesan */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Booking Details Card */}
          {bookingDetails && (
            <div className="rounded-xl bg-white dark:bg-neutral-800 p-4 shadow mb-6 max-w-md mx-auto">
              <h4 className="font-semibold text-center mb-3 text-sm">Booking details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">Date:</span>
                  <span>{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">Time:</span>
                  <span>{bookingDetails.time}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pesan-pesan */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {/* Timestamp Pembatas (Contoh: Today) */}
              {/* Logika untuk menampilkan timestamp pembatas bisa lebih kompleks */}
              {msg.id === "sys1" && <div className="text-center text-xs text-gray-400 dark:text-neutral-500 my-4">Today</div>}

              <div className={`flex items-end space-x-2 ${msg.type === 'sent' ? 'justify-end' : ''}`}>
                {msg.type !== 'sent' && (
                  <Image
                    src={msg.avatar || "/images/default-avatar.png"}
                    alt={msg.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full self-start object-cover" // self-start untuk avatar di atas
                  />
                )}
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-xl ${
                    msg.type === 'sent'
                      ? 'bg-brand-purple text-white rounded-br-none'
                      : msg.type === 'received'
                      ? 'bg-white dark:bg-neutral-700 text-text-light-primary dark:text-text-dark-primary rounded-bl-none shadow'
                      : 'bg-gray-200 dark:bg-neutral-600 text-text-light-primary dark:text-text-dark-primary text-center w-full max-w-sm mx-auto shadow' // System message
                  }`}
                >
                  {msg.type === 'received' && <p className="text-xs font-semibold text-brand-purple dark:text-purple-400 mb-0.5">{msg.name}</p>}
                  <p className={`text-sm ${msg.type === 'system' ? 'italic' : ''}`}>{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'sent' ? 'text-purple-200 dark:text-purple-300' : 'text-gray-400 dark:text-neutral-500'
                  } ${msg.type !== 'system' ? (msg.type === 'sent' ? 'text-right' : 'text-left') : 'text-center'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Pesan */}
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 rounded-full">
              <FaceSmileIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 rounded-full">
              <PaperClipIcon className="h-6 w-6" />
            </button>
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 py-2.5 px-4 text-sm focus:ring-brand-purple focus:border-brand-purple dark:focus:ring-purple-500 dark:focus:border-purple-500"
            />
            <button className="p-2.5 rounded-lg bg-brand-purple text-white hover:bg-purple-700">
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}