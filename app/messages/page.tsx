// app/dashboard/messages/page.tsx
"use client"; // Karena akan ada interaksi (meskipun contoh ini statis)

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline"; // atau solid jika preferensi
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"; // Untuk opsi tambahan jika perlu

// Data Types
interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  contactId: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface MessageData {
  contacts: Contact[];
  messages: Message[];
}

// API function to fetch message data
const fetchMessageData = async (userId: string): Promise<MessageData> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/messages/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      return {
        contacts: [],
        messages: []
      };
    }
  } catch (error) {
    console.error('Messages API error:', error);
    return {
      contacts: [],
      messages: []
    };
  }
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [messageData, setMessageData] = useState<MessageData>({
    contacts: [],
    messages: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadMessageData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchMessageData(user.id?.toString() || '');
        setMessageData(data);
        
        // Select first contact if available
        if (data.contacts.length > 0) {
          setSelectedContactId(data.contacts[0].id);
        }
      } catch (error) {
        console.error('Error loading message data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessageData();
  }, [user]);

  const { contacts, messages } = messageData;
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  const selectedMessages = messages.filter(message => message.contactId === selectedContactId);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim() && selectedContactId) {
      // In real app, this would be an API call
      console.log(`Sending message to contact ${selectedContactId}: ${newMessage}`);
      setNewMessage("");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex animate-pulse">
        <div className="w-1/3 bg-gray-200 dark:bg-neutral-700"></div>
        <div className="flex-1 bg-gray-100 dark:bg-neutral-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Silakan login untuk mengakses pesan.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-neutral-900">
      {/* Sidebar dengan daftar kontak */}
      <div className="w-1/3 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
        
        {/* Header Sidebar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Messages</h2>
          
          {/* Search Bar */}
          <div className="mt-3 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`p-4 border-b border-neutral-100 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                  selectedContactId === contact.id ? 'bg-brand-purple/10 dark:bg-brand-purple/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{contact.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-brand-purple rounded-full">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">Tidak ada kontak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                      {selectedContact.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedContact.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
              {selectedMessages.length > 0 ? (
                selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-brand-purple text-white'
                          : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-purple-200' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500 dark:text-neutral-400">Belum ada pesan</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="w-full px-4 py-2 pr-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-600 dark:text-neutral-300 hover:text-brand-purple transition-colors">
                    <FaceSmileIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Pilih percakapan
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Pilih kontak dari daftar untuk memulai percakapan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}