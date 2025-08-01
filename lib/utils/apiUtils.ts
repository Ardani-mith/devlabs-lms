/**
 * API Utilities with Rate Limit Handling
 * Provides retry logic for 429 (Too Many Requests) errors
 */

interface FetchWithRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryOn?: number[];
}

/**
 * Fetch with exponential backoff retry for rate limiting
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryOn = [429, 500, 502, 503, 504]
  } = retryOptions;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If successful or not a retryable error, return response
      if (response.ok || !retryOn.includes(response.status)) {
        return response;
      }

      // Handle rate limiting with special messaging
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : calculateDelay(attempt, baseDelay, maxDelay);
        
        console.warn(`Rate limited (429). ${retryAfter ? `Server requested ${retryAfter}s wait.` : ''} Retrying after ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        
        if (attempt < maxRetries) {
          await sleep(delay);
          continue;
        }
        
        // If we've exhausted retries, throw a specific error
        const waitTime = retryAfter ? `${retryAfter} seconds` : 'a moment';
        throw new Error(`Server is busy. Please wait ${waitTime} before trying again.`);
      }

      // For other retryable errors
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt, baseDelay, maxDelay);
        console.warn(`Request failed with ${response.status}. Retrying after ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await sleep(delay);
        continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry network errors on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = calculateDelay(attempt, baseDelay, maxDelay);
      console.warn(`Network error. Retrying after ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`, error);
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  return Math.round(exponentialDelay + jitter);
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * API client with built-in rate limit handling
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: RequestInit;

  constructor(baseUrl: string, defaultOptions: RequestInit = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...defaultOptions.headers,
      },
      ...defaultOptions,
    };
  }

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetchWithRetry(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async put<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetchWithRetry(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetchWithRetry(url, {
      method: 'DELETE',
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || '/api'
);

/**
 * Error types for better error handling
 */
export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public statusText: string) {
    super(message);
    this.name = 'ApiError';
  }
}
