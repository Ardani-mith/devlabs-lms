# React setState During Render Fix

## 🚨 Problem
```
Cannot update a component (`LessonViewer`) while rendering a different component (`YouTubePlayer`). 
To locate the bad setState() call inside `YouTubePlayer`, follow the stack trace.
```

## 🎯 Root Cause
- `onProgress` callback called directly during setState in `YouTubePlayer`
- Event handlers not properly memoized with `useCallback`
- State updates happening synchronously during render cycle
- React strict mode detecting improper state updates

## ✅ Solution Implemented

### 1. **Memoized Event Handlers dengan useCallback**

#### File: `app/courses/[slug]/lessons/[lessonId]/page.tsx`
```typescript
// Before: Not memoized - causes re-renders
const handleVideoProgress = async (progressPercent: number) => { ... };

// After: Properly memoized with useCallback
const handleVideoProgress = useCallback(async (progressPercent: number) => {
  // ... existing logic
}, [lesson, updateProgress]);

const handleLessonComplete = useCallback(async () => {
  // ... existing logic  
}, [lesson, lessonId]);

const handleBackToCourse = useCallback(() => {
  router.push(`/courses/${slug}`);
}, [router, slug]);
```

### 2. **useRef untuk Debouncing instead of useState**

#### Before: useState causing re-renders
```typescript
const [lastProgressUpdate, setLastProgressUpdate] = useState(0);

// In handler - causes setState during render
setLastProgressUpdate(now);
```

#### After: useRef - no re-renders
```typescript
const lastProgressUpdateRef = useRef<number>(0);

// In handler - no setState, just ref update
lastProgressUpdateRef.current = now;
```

### 3. **Fixed YouTubePlayer Component**

#### File: `components/video/YouTubePlayer.tsx`

#### Problem: setState + callback in same function
```typescript
// PROBLEMATIC CODE
intervalRef.current = setInterval(() => {
  setWatchTime(prev => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    
    // This causes setState during render!
    if (onProgress) {
      onProgress(newProgress);
    }
    
    return newWatchTime;
  });
}, 1000);
```

#### Solution: Separate state updates from callbacks
```typescript
// FIXED CODE
const startWatching = useCallback(() => {
  // ... setup ...
  
  intervalRef.current = setInterval(() => {
    setWatchTime(prev => {
      const newWatchTime = prev + 1;
      const newProgress = calculateProgress();
      
      setProgress(newProgress); // Only state update here
      
      return newWatchTime;
    });
  }, 1000);
}, [isWatching, duration]); // Removed onProgress from deps

// Separate effect for progress callback
const progressRef = useRef<number>(0);

useEffect(() => {
  progressRef.current = progress;
}, [progress]);

useEffect(() => {
  // Defer callback to avoid setState during render
  if (onProgress && progressRef.current > 0) {
    const timeoutId = setTimeout(() => {
      onProgress(progressRef.current);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }
}, [progress, onProgress]);
```

### 4. **Deferred Completion Callback**

#### Before: Direct callback causing setState during render
```typescript
const handleComplete = useCallback(() => {
  setProgress(100);
  setShowCompleteButton(false);
  stopWatching();
  
  if (onComplete) {
    onComplete(); // This can trigger setState in parent!
  }
}, [onComplete, stopWatching]);
```

#### After: Deferred callback with setTimeout
```typescript
const handleComplete = useCallback(() => {
  setProgress(100);
  setShowCompleteButton(false);
  stopWatching();
  
  // Defer the completion callback to avoid setState during render
  setTimeout(() => {
    if (onComplete) {
      onComplete();
    }
  }, 0);
}, [onComplete, stopWatching]);
```

## 🔧 Technical Details

### Why This Happens:
1. **Parent component renders** → Creates new callback functions
2. **Child component receives new props** → Triggers useEffect/useState
3. **Child calls parent callback** → Parent tries to setState
4. **React detects setState during render** → Shows warning/error

### React's Strict Mode:
- Detects side effects during render
- Helps catch potential bugs early
- Double-invokes effects in development

### setTimeout(fn, 0) Pattern:
- Defers execution to next tick
- Breaks the synchronous call chain
- Allows current render to complete first

## 📊 Before vs After

### Before Fix:
- ❌ React warning about setState during render
- ❌ Potential inconsistent state updates
- ❌ Event handlers recreated on every render
- ❌ Poor performance due to unnecessary re-renders

### After Fix:
- ✅ No React warnings
- ✅ Consistent state management
- ✅ Memoized event handlers with useCallback
- ✅ Better performance with reduced re-renders
- ✅ Proper separation of concerns

## 🚀 Performance Benefits

### 1. **Reduced Re-renders**
- useCallback prevents function recreation
- useRef avoids state updates for debouncing
- setTimeout defers heavy operations

### 2. **Better Memory Management**
- Proper cleanup of intervals and timeouts
- useRef for values that don't need re-renders
- Memoized callbacks reduce garbage collection

### 3. **Improved User Experience**
- Smoother progress tracking
- No React warnings in console
- More responsive UI updates

## 🎯 Best Practices Applied

### 1. **useCallback for Event Handlers**
```typescript
const handleEvent = useCallback((param) => {
  // handler logic
}, [dependencies]);
```

### 2. **useRef for Non-State Values**
```typescript
const valueRef = useRef(initialValue);
// Update: valueRef.current = newValue (no re-render)
```

### 3. **Defer Side Effects**
```typescript
// Instead of direct call
callback();

// Use setTimeout to defer
setTimeout(callback, 0);
```

### 4. **Separate State and Effects**
```typescript
// Separate state updates from side effects
useEffect(() => {
  // State update
  setState(newValue);
}, [dependency]);

useEffect(() => {
  // Side effect (API call, callback)
  sideEffect();
}, [state]);
```

## 🔮 Future Enhancements

### 1. **React 18 Features**
- `useDeferredValue` for non-urgent updates
- `useTransition` for expensive state updates
- `startTransition` for marking non-urgent updates

### 2. **Custom Hooks**
- Extract progress tracking to custom hook
- Reusable debouncing hook
- Generic video player hook

### 3. **Performance Monitoring**
- React DevTools Profiler
- Performance metrics tracking
- Real-time re-render monitoring

---
*Updated: August 4, 2025*
*Status: ✅ Complete - React setState during render fixed*
