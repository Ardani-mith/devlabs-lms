# User Journey Testing Guide

## Cara Menguji Enrollment Flow dan UI Changes

Panduan ini menjelaskan cara menguji secara komprehensif user journey mulai dari melihat course sebagai user yang tidak terdaftar, mendaftar course, hingga melihat perubahan UI setelah enrollment.

## Setup Development Environment

1. **Pastikan Backend Running:**
   ```bash
   cd lms-backend
   npm run start:dev
   # Backend should run on http://localhost:4300
   ```

2. **Pastikan Frontend Running:**
   ```bash
   cd lms-high-end
   npm run dev
   # Frontend should run on http://localhost:3000
   ```

## Testing Scenarios

### 1. Testing Course View sebagai Non-Enrolled User

#### Steps:
1. Buka browser dan navigasi ke `http://localhost:3000/courses`
2. Pilih salah satu course dan klik untuk melihat detail
3. **Expected Results:**
   - Course info sidebar menampilkan tombol "Daftar Gratis" atau "Daftar Kursus Sekarang"
   - Module accordion menampilkan icon lock untuk lessons yang tidak previewable
   - Info banner menjelaskan bahwa beberapa content preview dan yang lain terkunci
   - Tab "Diskusi" dan "Tugas & Kuis" tidak terlihat
   - No progress bar visible

### 2. Testing Enrollment menggunakan Test Control Panel

#### Steps:
1. Di course detail page (development mode), lihat Test Control Panel di kanan bawah
2. Klik tombol Settings (⚙️) untuk membuka panel
3. Klik "Simulate Enrollment" button
4. **Expected Results:**
   - Progress bar muncul di sidebar (0% progress)
   - Tombol "Daftar" berubah menjadi progress indicator
   - Tab "Diskusi" dan "Tugas & Kuis" muncul
   - Module lessons tidak lagi menampilkan lock icons untuk content yang sebelumnya terkunci
   - Info banner hilang atau berubah untuk enrolled users

### 3. Testing Lesson Progress Simulation

#### Steps:
1. Setelah enrollment, di Test Control Panel
2. Klik "Complete Lesson" untuk beberapa lessons
3. Observasi perubahan progress bar
4. **Expected Results:**
   - Progress bar percentage meningkat
   - Completed lessons menampilkan check mark atau status "selesai"
   - "Continue Learning" button muncul dengan lesson terakhir yang diakses

### 4. Testing UI State Persistence

#### Steps:
1. Refresh page setelah simulate enrollment
2. Navigate ke course lain dan kembali
3. **Expected Results:**
   - Enrollment status tetap preserved (menggunakan localStorage)
   - Progress dan completed lessons masih terlihat
   - UI state consistent

### 5. Testing Reset Functionality

#### Steps:
1. Di Test Control Panel, klik "Reset Enrollment"
2. **Expected Results:**
   - Kembali ke state non-enrolled user
   - Progress bar hilang
   - Tombol "Daftar" muncul lagi
   - Tabs enrollment-specific hilang

## Test Control Panel Features

Panel pengujian tersedia di **development mode only** dan menyediakan:

- **🔧 Settings Button**: Buka/tutup panel
- **👤 Simulate Enrollment**: Daftarkan user ke course
- **✅ Complete Lesson**: Tandai lesson sebagai selesai
- **🗑️ Reset Enrollment**: Reset ke state non-enrolled
- **📊 Progress Display**: Tampilkan current progress percentage

## Expected UI Changes

### Before Enrollment:
```
┌─────────────────┐
│ Course Info     │
│ ──────────────  │
│ Price: GRATIS   │
│ [Daftar Gratis] │
│ [Add Wishlist]  │
└─────────────────┘

┌─────────────────┐
│ Tabs:           │
│ Overview | Mat. │
└─────────────────┘

┌─────────────────┐
│ Module 1        │
│ ──────────────  │
│ 🔒 Lesson 1     │
│ 👁️ Lesson 2     │
│ 🔒 Lesson 3     │
└─────────────────┘
```

### After Enrollment:
```
┌─────────────────┐
│ Progress: 25%   │
│ ████░░░░░░░░    │
│ [Lanjutkan:     │
│  Lesson 2]      │
└─────────────────┘

┌─────────────────┐
│ Tabs:           │
│ Over|Mat|Disk|.. │
└─────────────────┘

┌─────────────────┐
│ Module 1        │
│ ──────────────  │
│ ✅ Lesson 1     │
│ ▶️ Lesson 2     │
│ ▶️ Lesson 3     │
└─────────────────┘
```

## Debug Information

Test control panel juga menampilkan debug information:
- **Enrollment Status**: true/false
- **Progress Percentage**: 0-100%
- **Completed Lessons**: Array of lesson IDs
- **Last Accessed**: Lesson information

## Browser Console Logs

Untuk debugging, check browser console untuk:
```
🎉 Simulated enrollment for course: [slug]
✅ Simulated lesson completion: [lesson-title]
🗑️ Reset enrollment for course: [slug]
Test enrollment data changed: {...}
```

## API Integration Points

Sistem testing saat ini menggunakan localStorage untuk simulate enrollment, tapi dalam production akan terintegrasi dengan:

1. **POST /courses/{slug}/enroll** - Enrollment endpoint
2. **POST /courses/{slug}/lessons/{id}/complete** - Mark lesson complete
3. **GET /user/enrollments** - Get user enrollments
4. **GET /user/progress/{courseSlug}** - Get course progress

## Troubleshooting

### Test Control Panel tidak muncul:
- Pastikan `NODE_ENV=development`
- Refresh page
- Check browser console for errors

### State tidak berubah setelah simulate:
- Check localStorage in browser dev tools
- Look for `test_enrollment_data_[courseSlug]` key
- Check console for error messages

### UI tidak update setelah enrollment change:
- Ensure event listeners properly attached
- Check if `enrollmentChanged` event is fired
- Verify component re-renders with updated state

## Production Considerations

Sebelum production:
1. Remove TestControlPanel import dan usage
2. Remove test enrollment utilities
3. Implement real API integration untuk enrollment
4. Add proper error handling untuk enrollment flows
5. Add loading states untuk enrollment actions
