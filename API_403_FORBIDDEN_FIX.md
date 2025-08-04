# API Error 403 Forbidden Resource Fix

## 🚨 Problem
- Error "Forbidden resource" muncul saat mengakses lesson progress
- 403 responses diperlakukan sebagai hard errors yang break functionality
- User tidak bisa melihat lesson karena progress API access denied
- No graceful degradation untuk authorization issues

## 🎯 Root Cause
- User mungkin belum enrolled di course
- Backend API membatasi akses lesson progress untuk non-enrolled users
- Frontend tidak menangani 403 authorization errors dengan graceful
- Progress tracking dianggap required padahal seharusnya optional

## ✅ Solution Implemented

### 1. **Enhanced 403 Error Handling di API Client**

#### File: `lib/api/client.ts`
```typescript
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
}
```

### 2. **Graceful 403 Handling di Lesson Endpoints**

#### File: `lib/api/endpoints/lessons.ts`

#### getProgress Function:
```typescript
// Handle 403 (forbidden) gracefully - user might not be enrolled
if (error.response?.status === 403 || error.message?.includes('Forbidden')) {
  console.warn(`Access denied for lesson ${lessonId} progress. User might not be enrolled.`);
  const defaultData = {
    progress: 0,
    isCompleted: false,
    completedAt: null,
    watchTime: 0,
    accessDenied: true
  };
  
  // Cache for shorter time as enrollment status might change
  progressCache.set(cacheKey, defaultData, 5000); // Cache for 5 seconds
  
  return defaultData;
}
```

#### updateProgress Function:
```typescript
// Handle forbidden access - user might not be enrolled
if (error.response?.status === 403 || error.message?.includes('Forbidden')) {
  console.warn(`Access denied for lesson ${lessonId} progress update. User might not be enrolled.`);
  // Return message indicating access issue
  return { message: 'Progress update requires course enrollment' };
}
```

### 3. **Non-Critical Progress Updates di Hooks**

#### File: `lib/api/hooks/useLessons.ts`

#### Load Progress:
```typescript
} else if (err.status === 403 || err.message?.includes('Forbidden')) {
  // Handle 403 - user might not be enrolled or lack permissions
  setIsCompleted(false);
  setCompletedAt(null);
  console.warn(`Access denied for lesson ${lessonId} progress. User might not be enrolled.`);
  // Don't set this as a hard error - lesson can still be viewed
}
```

#### Update Progress:
```typescript
// Handle 403 forbidden gracefully - user might not be enrolled
if (err.status === 403 || err.message?.includes('Forbidden')) {
  console.warn(`Access denied for lesson ${lessonId} progress update. User might not be enrolled.`);
  // Don't throw error - let the lesson continue to play
  return;
}
// Don't throw error for progress updates - they're not critical
console.warn('Progress update failed:', err);
```

### 4. **Key Features of the Fix**

#### Graceful Degradation:
- ✅ **Lesson still playable** - 403 doesn't break lesson viewing
- ✅ **Default progress values** - Return sensible defaults
- ✅ **Silent failures** - Progress tracking fails silently
- ✅ **Shorter cache times** - Allow for enrollment status changes

#### Smart Error Categorization:
- ✅ **Expected errors** (404, 429) → Info logs
- ✅ **Access errors** (403) → Warning logs  
- ✅ **Actual errors** (500, network) → Error logs
- ✅ **User-friendly messages** - No technical jargon

## 🎯 Business Logic Alignment

### User Enrollment Scenarios:

#### 1. **Non-Enrolled User**
- Can view lesson content ✅
- Cannot track progress (403) → Handled gracefully ✅
- Sees default progress state (0%) ✅
- No error messages shown ✅

#### 2. **Enrolled User**
- Can view lesson content ✅
- Can track progress ✅
- Progress persisted across sessions ✅
- Full functionality available ✅

#### 3. **Network Issues**
- Lesson content loads from cache ✅
- Progress tracking fails silently ✅
- User can continue learning ✅
- Retry mechanisms active ✅

## 📊 Error Handling Matrix

| Status Code | Scenario | Handling | User Impact |
|-------------|----------|----------|-------------|
| 200 | Success | Normal flow | Full functionality |
| 403 | Not enrolled | Default data + warning | Lesson works, no progress |
| 404 | No progress yet | Default data + info | Lesson works, starts at 0% |
| 429 | Rate limited | Cached/default data | Lesson works, retry later |
| 500 | Server error | Show error message | User sees error, can retry |

## 🚀 Benefits

### 1. **Better User Experience**
- No broken lesson viewers due to progress API
- Silent handling of enrollment issues
- Lessons remain accessible to all users

### 2. **Robust Error Handling**
- Different strategies for different error types
- Graceful degradation patterns
- Proper logging for debugging

### 3. **Business Logic Flexibility**
- Support for freemium models (view but don't track progress)
- Easy to add enrollment checks later
- Compatible with various access control models

### 4. **Performance Benefits**
- Reduced error noise in logs
- Smart caching strategies
- Shorter cache times for access-denied responses

## 🔧 Implementation Details

### Error Detection:
```typescript
// Multiple ways to detect 403 errors
const isForbidden = 
  error.status === 403 || 
  error.response?.status === 403 || 
  error.message?.includes('Forbidden') ||
  error.message?.includes('forbidden');
```

### Default Data Structure:
```typescript
const defaultProgressData = {
  progress: 0,
  isCompleted: false,
  completedAt: null,
  watchTime: 0,
  accessDenied: true // Flag for UI logic
};
```

### Caching Strategy:
- **Normal data**: 30 seconds cache
- **404 (not found)**: 10 seconds cache  
- **403 (forbidden)**: 5 seconds cache (enrollment might change)
- **429 (rate limited)**: No cache

## 🎯 Testing Scenarios

### 1. **Non-Enrolled User Opens Lesson**
1. Lesson loads normally ✅
2. Progress API returns 403 ✅
3. Default progress (0%) shown ✅
4. No error messages to user ✅
5. Video plays normally ✅

### 2. **Enrolled User with Progress**
1. Lesson loads normally ✅
2. Progress API returns data ✅
3. Previous progress restored ✅
4. Progress updates work ✅

### 3. **User Enrolls Mid-Session**
1. Initially 403 on progress ✅
2. After enrollment, progress works ✅
3. Short cache time allows quick update ✅

---
*Updated: August 4, 2025*
*Status: ✅ Complete - 403 Forbidden error handling implemented*
