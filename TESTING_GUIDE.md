# 🧪 Panduan Testing User Journey LMS

## 📋 Overview
Panduan ini akan membantu Anda menguji semua aspek user journey dari pendaftaran course hingga penyelesaian, termasuk perubahan tampilan UI yang dinamis.

## 🛠️ Tools Testing yang Tersedia

### 1. **TestControlPanel** (Development Mode)
Panel kontrol terintegrasi yang muncul di mode development untuk simulasi enrollment.

**Lokasi**: Muncul otomatis di halaman course detail saat `NODE_ENV=development`

**Fitur**:
- ✅ Simulasi enrollment/non-enrollment 
- ✅ Set progress pembelajaran (0-100%)
- ✅ Simulasi penyelesaian lesson tertentu
- ✅ Reset status enrollment
- ✅ Real-time update UI

### 2. **Test Utilities** (`/lib/utils/testEnrollment.ts`)
```typescript
// Simulasi enrollment
simulateEnrollment(courseSlug: string)

// Simulasi lesson selesai
simulateLessonComplete(courseSlug: string, lessonId: string, lessonTitle: string)

// Reset enrollment
resetEnrollment(courseSlug: string)

// Get data enrollment
getTestEnrollmentData(courseSlug: string)
```

## 🎯 Skenario Testing User Journey

### **Skenario 1: User Belum Mendaftar**
**Tujuan**: Test tampilan course untuk non-enrolled user

**Steps**:
1. Buka halaman course: `http://localhost:3000/courses/[course-slug]`
2. Pastikan TestControlPanel menunjukkan "Not Enrolled"
3. **Verifikasi UI**:
   - ✅ Info banner "Mode Preview - Belum Terdaftar" muncul
   - ✅ Sidebar menampilkan tombol "Daftar Gratis" atau "Daftar Kursus Sekarang"
   - ✅ Lessons menampilkan ikon lock/preview dengan badge "PREVIEW" atau "TERKUNCI"
   - ✅ Tab "Materi Pembelajaran" menunjukkan banner preview
   - ✅ Progress bar tidak muncul

**Expected Result**: UI menampilkan mode preview dengan akses terbatas

### **Skenario 2: User Baru Mendaftar (0% Progress)**
**Tujuan**: Test tampilan setelah enrollment

**Steps**:
1. Di TestControlPanel, klik "Simulate Enrollment"
2. **Verifikasi UI berubah**:
   - ✅ Header: "Daftar Gratis" berubah ke "Mulai Belajar Sekarang"
   - ✅ Header: "Simpan ke Wishlist" button HILANG
   - ✅ Header: Progress bar muncul dengan 0%
   - ✅ Info banner berubah ke "Progress Pembelajaran Anda: 0%"
   - ✅ Sidebar: "Daftar Gratis" HILANG, diganti "Progres Belajar Anda: 0% Selesai"
   - ✅ Lessons tidak lagi menampilkan ikon lock (akses penuh)
   - ✅ Banner preview hilang

**Expected Result**: UI berubah ke mode enrolled dengan akses penuh, SEMUA tombol enrollment hilang

### **Skenario 3: User Sedang Belajar (Progress Partial)**
**Tujuan**: Test tampilan dengan progress pembelajaran

**Steps**:
1. Simulasikan beberapa lesson selesai:
   ```typescript
   simulateLessonComplete('course-slug', 'lesson-1', 'Introduction')
   simulateLessonComplete('course-slug', 'lesson-2', 'Getting Started')
   ```
2. Atau gunakan TestControlPanel "Complete Lesson" button
3. **Verifikasi UI**:
   - ✅ Progress bar terupdate (misal 20%)
   - ✅ Banner menampilkan "Progress Anda: 20%"
   - ✅ Lessons yang selesai menampilkan ikon checkmark
   - ✅ Counter "X pelajaran telah selesai" terupdate

**Expected Result**: UI menampilkan progress yang akurat

### **Skenario 4: User Menyelesaikan Course (100% Progress)**
**Tujuan**: Test tampilan course completion

**Steps**:
1. Set progress ke 100% melalui TestControlPanel
2. **Verifikasi UI**:
   - ✅ Progress bar penuh (100%)
   - ✅ Banner menampilkan "Progress Anda: 100%"
   - ✅ Tombol "Unduh Sertifikat" muncul di sidebar
   - ✅ Semua lessons menampilkan status selesai
   - ✅ Related courses section muncul
   - ✅ Tab sertifikat dapat diakses

**Expected Result**: UI menampilkan course completion dengan akses sertifikat

### **Skenario 5: Reset dan Test Ulang**
**Tujuan**: Verifikasi consistency testing

**Steps**:
1. Klik "Reset Enrollment" di TestControlPanel
2. Refresh halaman
3. Ulangi skenario 1-4
4. **Verifikasi**:
   - ✅ Reset kembali ke state non-enrolled
   - ✅ UI konsisten pada setiap testing cycle
   - ✅ No memory leaks atau state corruption

## 🎨 UI/UX Elements yang Harus Ditest

### **Course Detail Page**
- [ ] Course header responsif
- [ ] **Enrollment buttons (Daftar/Wishlist) hilang setelah enrolled**
- [ ] **Progress bar muncul setelah enrolled**
- [ ] **Button text berubah: "Daftar" → "Mulai/Lanjutkan Belajar"**
- [ ] Tabs navigation (Overview, Materi, Diskusi, Sertifikat)
- [ ] Info banners conditional rendering
- [ ] Course content organization

### **Sidebar (CourseInfoSidebar)**
- [ ] Course info tetap konsisten
- [ ] Enrollment buttons (Daftar/Beli)
- [ ] Progress bar dan percentage
- [ ] Continue learning button
- [ ] Certificate download button
- [ ] Price display untuk non-enrolled

### **Lessons/Modules (ModuleAccordion & LessonItem)**
- [ ] Lesson status icons (preview/lock/complete)
- [ ] Lesson badges (PREVIEW/TERKUNCI/SELESAI)
- [ ] Module collapse/expand
- [ ] Lesson accessibility berdasarkan enrollment
- [ ] YouTube embed preview

### **Responsive Design**
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] Dark mode compatibility

## 🔧 Development Testing Commands

```bash
# Start development server
npm run dev

# Check browser console untuk logs
# TestControlPanel akan muncul di development mode

# Useful console commands untuk debug:
localStorage.clear() // Clear test data
getTestEnrollmentData('course-slug') // Check current test data
```

## 📱 Manual Testing Checklist

### Pre-Test Setup
- [ ] Backend server running di `http://localhost:4300`
- [ ] Frontend server running di `http://localhost:3000`
- [ ] Browser dev tools terbuka untuk monitoring
- [ ] Test dengan minimal 2 course slugs berbeda

### Test Execution
- [ ] Test semua skenario di desktop Chrome
- [ ] Test semua skenario di mobile viewport
- [ ] Test dengan dark/light mode
- [ ] Test dengan slow network connection
- [ ] Test browser refresh behavior
- [ ] Test multiple tabs behavior

### Bug Documentation
Jika menemukan bug:
1. Screenshot/screen record
2. Console error logs
3. Network request logs
4. Steps to reproduce
5. Expected vs actual behavior

## 🚀 Advanced Testing

### **E2E Testing dengan Playwright/Cypress**
```typescript
// Example test case
test('User enrollment journey', async ({ page }) => {
  await page.goto('/courses/react-fundamentals');
  
  // Test non-enrolled state
  await expect(page.locator('[data-testid="preview-banner"]')).toBeVisible();
  
  // Simulate enrollment
  await page.click('[data-testid="enroll-button"]');
  
  // Verify enrolled state
  await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
});
```

### **API Testing**
- Test enrollment endpoint: `POST /courses/:slug/enroll`
- Test lesson completion: `POST /courses/:slug/lessons/:id/complete`
- Test progress tracking: `GET /courses/:slug/progress`

## 📊 Performance Testing
- [ ] Page load time < 2s
- [ ] Lighthouse score > 90
- [ ] Memory usage monitoring
- [ ] Bundle size optimization

## ✅ Definition of Done
Course enrollment flow dianggap selesai dan berfungsi jika:

1. ✅ Semua 5 skenario testing berhasil
2. ✅ UI responsive di semua device sizes
3. ✅ No console errors atau warnings
4. ✅ Smooth transitions antar states
5. ✅ Data persistence working correctly
6. ✅ Real backend integration tested
7. ✅ Performance benchmarks met
8. ✅ User experience intuitive dan smooth

---

**Happy Testing! 🎉**

*File ini akan terus diupdate seiring development progress.*

## 🎯 Quick UI Behavior Test

```bash
# Run specific enrollment UI behavior test
./test-enrollment-ui.sh

# This script provides detailed checklist for:
# - Non-enrolled state UI elements
# - Enrolled state UI elements  
# - Proper button visibility/hiding
# - Progress bar behavior
# - State transition validation
```

**Key UI Behavior Rules:**
- ❌ **NO** enrollment buttons after user enrolls
- ❌ **NO** wishlist button for enrolled users
- ✅ **YES** progress bar for enrolled users
- ✅ **YES** "Mulai/Lanjutkan Belajar" button for enrolled users
