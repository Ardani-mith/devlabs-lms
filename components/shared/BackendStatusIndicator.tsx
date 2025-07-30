"use client";

import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/services/apiService';

interface BackendStatus {
  isConnected: boolean;
  message: string;
  timestamp: Date;
}

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    message: 'Checking connection...',
    timestamp: new Date()
  });

  const checkBackendStatus = async () => {
    try {
      // Try to ping the backend health endpoint
      await ApiService.get('/health');
      setStatus({
        isConnected: true,
        message: 'Backend connected',
        timestamp: new Date()
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        message: 'Backend disconnected',
        timestamp: new Date()
      });
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 shadow-lg
        ${status.isConnected 
          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
        }
      `}>
        <div className={`w-2 h-2 rounded-full ${status.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{status.message}</span>
        <button 
          onClick={checkBackendStatus}
          className="ml-2 text-xs opacity-70 hover:opacity-100"
          title="Refresh status"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
