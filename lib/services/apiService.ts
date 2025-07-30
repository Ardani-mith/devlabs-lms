// API Error handling utilities

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export class ApiService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300';

  static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Debug logging untuk development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body
      });
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Debug logging untuk development
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 API Response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
      }

      if (!response.ok) {
        throw {
          message: data.message || data.error || `HTTP Error: ${response.status}`,
          status: response.status,
          details: data
        } as ApiError;
      }

      return data;
    } catch (error) {
      // Debug logging untuk development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', error);
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Unable to connect to server. Please check your internet connection.',
          status: 0,
          details: error
        } as ApiError;
      }
      
      throw error;
    }
  }

  static async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  static async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Auth specific API calls
export const AuthAPI = {
  async login(username: string, password: string): Promise<{ access_token: string }> {
    return ApiService.post('/auth/login', { username, password });
  },

  async getProfile(token: string): Promise<any> {
    return ApiService.get('/users/profile/me', token);
  },

  async updateProfile(data: any, token: string): Promise<any> {
    return ApiService.patch('/users/profile/me', data, token);
  }
};
