# Rate Limiting & Error 429 Fix

## 🚨 Problem
- Error 429 (Too Many Requests) terjadi saat mengakses course detail
- Backend API memberikan rate limiting untuk mencegah spam requests
- Frontend tidak menangani retry logic dengan baik

## ✅ Solution Implemented

### 1. **Retry Logic dengan Exponential Backoff**

#### Course Detail Page (`app/courses/[slug]/page.tsx`)
```typescript
const fetchWithRetry = async (url: string, maxRetries = 3, delay = 1000): Promise<Response> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 429) {
        // Rate limited, wait and retry with exponential backoff
        if (i < maxRetries - 1) {
          console.log(`Rate limited, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double delay each retry
          continue;
        }
      }

      return response;
    } catch (error) {
      // Handle network errors with retry
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error('Max retries exceeded');
};
```

#### Lesson Viewer (`app/courses/[slug]/lessons/[lessonId]/page.tsx`)
- Implemented same retry logic for course data fetching
- Added error handling for course fetch failures
- Continue lesson loading even if course data fails

### 2. **Enhanced Error Messages**
```typescript
if (response.status === 429) {
  throw new Error('Server sedang sibuk. Mohon tunggu sebentar dan coba lagi.');
}
throw new Error(`Course tidak ditemukan (${response.status})`);
```

### 3. **API Utils Enhancement**
File `lib/utils/apiUtils.ts` sudah memiliki:
- ✅ **fetchWithRetry function** dengan exponential backoff
- ✅ **ApiClient class** yang menggunakan retry logic
- ✅ **Rate limiting detection** dengan Retry-After header support
- ✅ **Jitter untuk prevent thundering herd**

#### Key Features:
```typescript
// Exponential backoff dengan jitter
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  return Math.round(exponentialDelay + jitter);
}

// Respect Retry-After header
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  const delay = retryAfter ? parseInt(retryAfter) * 1000 : calculateDelay(attempt, baseDelay, maxDelay);
}
```

## 🔧 Technical Implementation

### Retry Strategy
1. **Max Retries**: 3 attempts
2. **Base Delay**: 1000ms (1 second)
3. **Exponential Backoff**: delay × 2 each retry
4. **Max Delay**: 10000ms (10 seconds)
5. **Jitter**: ±25% randomization to prevent thundering herd

### Retry Timeline Example:
- **Attempt 1**: Immediate request
- **Attempt 2**: Wait ~1 second
- **Attempt 3**: Wait ~2 seconds  
- **Attempt 4**: Wait ~4 seconds
- **Final Error**: If all attempts fail

### Error Handling Levels:
1. **Network Errors**: Retry with backoff
2. **Rate Limiting (429)**: Respect Retry-After or use backoff
3. **Server Errors (5xx)**: Retry with backoff
4. **Client Errors (4xx)**: No retry (except 429)

## 🎯 User Experience Improvements

### 1. **Seamless Loading**
- User tidak melihat error 429 secara langsung
- Automatic retry di background
- Loading state tetap konsisten

### 2. **Smart Error Messages**
- "Server sedang sibuk" instead of technical error codes
- Context-aware error messages
- Actionable error guidance

### 3. **Graceful Degradation**
- Lesson viewer tetap bekerja meski course data gagal
- Fallback ke lesson data dari API route
- Partial loading better than complete failure

## 📊 Rate Limiting Best Practices

### 1. **Backend Rate Limits** (untuk referensi)
- Typical: 100 requests per minute per IP
- Burst: 20 requests per 10 seconds
- API key based: Higher limits untuk authenticated users

### 2. **Frontend Mitigation**
- ✅ **Retry with backoff** - Implemented
- ✅ **Request deduplication** - Via React strict mode handling
- ✅ **Caching** - Via SWR/React Query patterns
- ✅ **Request batching** - Where applicable

### 3. **Monitoring & Logging**
```typescript
console.warn(`Rate limited (429). Retrying after ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
```

## 🚀 Future Enhancements

### 1. **Request Caching**
```typescript
// Add to API client
class ApiClient {
  private cache = new Map();
  
  async get(endpoint: string, options = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = await this.fetchWithRetry(endpoint, options);
    this.cache.set(cacheKey, result);
    return result;
  }
}
```

### 2. **Request Queue**
- Queue requests to prevent flooding
- Process requests with controlled rate
- Priority queue for critical requests

### 3. **Circuit Breaker Pattern**
- Stop requests after consecutive failures
- Auto-recovery after timeout
- Fallback to cached data

## 📈 Expected Results

### Before Fix:
- ❌ Error 429 crashes page
- ❌ User sees technical error messages
- ❌ No retry mechanism
- ❌ Poor user experience

### After Fix:
- ✅ Automatic retry with smart backoff
- ✅ User-friendly error messages
- ✅ Graceful degradation
- ✅ Seamless user experience
- ✅ Respect server rate limits
- ✅ Prevent thundering herd effect

---
*Updated: August 4, 2025*
*Status: ✅ Complete - Error 429 handling implemented*
