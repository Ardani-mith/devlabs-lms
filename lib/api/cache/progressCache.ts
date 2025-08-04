/**
 * Simple progress cache to prevent repeated API calls
 */

interface ProgressCacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number; // in milliseconds
}

class ProgressCache {
  private cache = new Map<string, ProgressCacheEntry>();
  private readonly DEFAULT_EXPIRE_TIME = 30000; // 30 seconds

  set(key: string, data: any, expiresIn: number = this.DEFAULT_EXPIRE_TIME) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

export const progressCache = new ProgressCache();

// Cleanup expired entries every minute
setInterval(() => {
  progressCache.cleanup();
}, 60000);
