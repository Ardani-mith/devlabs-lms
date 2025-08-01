"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiService } from '@/lib/services/apiService';

interface BackendStatus {
  isConnected: boolean;
  message: string;
  timestamp: Date;
}

// Global cache for backend status to avoid multiple simultaneous requests
let globalStatusCache: {
  status: BackendStatus | null;
  lastCheck: number;
  isChecking: boolean;
} = {
  status: null,
  lastCheck: 0,
  isChecking: false
};

const CACHE_DURATION = 60000; // 1 minute cache
const CHECK_INTERVAL = 120000; // Check every 2 minutes (reduced from 30 seconds)

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    message: 'Checking connection...',
    timestamp: new Date()
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const checkBackendStatus = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    
    // Use cached status if available and not expired
    if (!force && globalStatusCache.status && (now - globalStatusCache.lastCheck) < CACHE_DURATION) {
      if (mountedRef.current) {
        setStatus(globalStatusCache.status);
      }
      return;
    }

    // Prevent multiple simultaneous requests
    if (globalStatusCache.isChecking && !force) {
      return;
    }

    globalStatusCache.isChecking = true;

    try {
      // Try to ping the backend health endpoint with a timeout
      await ApiService.get('/health');
      const newStatus: BackendStatus = {
        isConnected: true,
        message: 'Backend connected',
        timestamp: new Date()
      };
      
      globalStatusCache.status = newStatus;
      globalStatusCache.lastCheck = now;
      
      if (mountedRef.current) {
        setStatus(newStatus);
      }
    } catch (error) {
      const newStatus: BackendStatus = {
        isConnected: false,
        message: 'Backend disconnected',
        timestamp: new Date()
      };
      
      globalStatusCache.status = newStatus;
      globalStatusCache.lastCheck = now;
      
      if (mountedRef.current) {
        setStatus(newStatus);
      }
    } finally {
      globalStatusCache.isChecking = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial check
    checkBackendStatus();
    
    // Set up interval for periodic checks
    intervalRef.current = setInterval(() => {
      checkBackendStatus();
    }, CHECK_INTERVAL);
    
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkBackendStatus]);

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
          onClick={() => checkBackendStatus(true)}
          className="ml-2 text-xs opacity-70 hover:opacity-100"
          title="Refresh status"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
