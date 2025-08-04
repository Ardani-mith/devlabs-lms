/**
 * Enhanced API Client for LMS Application
 * Provides centralized API management with type safety, error handling, and dev tools
 */

// Base Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  field?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}

// API Client Class
export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private defaultTimeout = 30000; // 30 seconds
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300';
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Token management
  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  // Request timeout handler
  private withTimeout(promise: Promise<Response>, ms: number): Promise<Response> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    );
    return Promise.race([promise, timeout]);
  }

  // Retry mechanism
  private async retryRequest(
    url: string,
    config: RequestConfig,
    retries: number = 2
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.defaultTimeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (retries > 0 && (error as Error).name !== 'AbortError') {
        console.warn(`Request failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        return this.retryRequest(url, config, retries - 1);
      }
      throw error;
    }
  }

  // Main request method
  public async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers as Record<string, string>,
    };

    // Add auth token if available and not skipped
    if (this.token && !config.skipAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // Prepare final config
    const finalConfig: RequestConfig = {
      ...config,
      headers,
    };

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚀 API ${finalConfig.method || 'GET'} ${endpoint}`);
      console.log('URL:', url);
      console.log('Headers:', headers);
      if (finalConfig.body) {
        console.log('Body:', finalConfig.body);
      }
      console.groupEnd();
    }

    try {
      const response = await this.retryRequest(url, finalConfig, config.retries);
      const responseData = await response.json();

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.group(`📡 API Response ${response.status}`);
        console.log('Status:', response.status, response.statusText);
        console.log('Data:', responseData);
        console.groupEnd();
      }

      if (!response.ok) {
        const apiError: ApiError = {
          message: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: responseData.code,
          details: responseData.details,
          field: responseData.field,
        };

        // Show error toast unless skipped or it's an expected error (404, 429)
        if (!config.skipErrorToast && typeof window !== 'undefined') {
          // Don't show error toast for expected errors
          const isExpectedError = response.status === 404 || response.status === 429 || 
                                 responseData.message?.includes('not found') ||
                                 responseData.message?.includes('Lesson progress not found');
          
          // Handle 403 Forbidden specifically
          const isForbiddenError = response.status === 403 || 
                                  responseData.message?.includes('Forbidden') ||
                                  responseData.message?.includes('forbidden');
          
          if (isForbiddenError) {
            console.warn('Access denied:', apiError.message);
            // Could redirect to login or show access denied message
            // window.location.href = '/auth/login';
          } else if (!isExpectedError) {
            console.error('API Error:', apiError.message);
            // You can integrate with your preferred toast library here
            // toast.error(apiError.message);
          } else {
            // Log expected errors as info instead
            console.info('Expected API response:', apiError.message);
          }
        }

        throw apiError;
      }

      return responseData;
    } catch (error) {
      // Handle network errors, timeouts, etc.
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError: ApiError = {
          message: 'Request timeout - please check your connection',
          status: 408,
          code: 'TIMEOUT_ERROR',
        };
        
        if (!config.skipErrorToast && typeof window !== 'undefined') {
          console.error('API Timeout:', timeoutError.message);
          // You can integrate with your preferred toast library here
          // toast.error(timeoutError.message);
        }
        
        throw timeoutError;
      }

      // Re-throw API errors
      if ((error as ApiError).status) {
        throw error;
      }

      // Handle unknown errors
      const unknownError: ApiError = {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
        details: error,
      };

      if (!config.skipErrorToast && typeof window !== 'undefined') {
        console.error('API Network Error:', unknownError.message);
        // You can integrate with your preferred toast library here
        // toast.error(unknownError.message);
      }

      throw unknownError;
    }
  }

  // Convenience methods
  public async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // File upload method
  public async upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    config?: Omit<RequestConfig, 'headers'>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {};
    
    // Add auth token if available and not skipped
    if (this.token && !config?.skipAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();

// Utility function for manual API calls
export const api = {
  get: <T = any>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  put: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T = any>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  upload: <T = any>(endpoint: string, file: File, additionalData?: Record<string, any>, config?: RequestConfig) => 
    apiClient.upload<T>(endpoint, file, additionalData, config),
};

export default apiClient;
