# 🗄️ Database Integration Guide - YouTube Course Management

## 🎯 **Masalah Saat Ini**
Upload thumbnail sudah berfungsi di frontend, tetapi data belum tersimpan ke database karena:
1. Backend belum memiliki field YouTube di database
2. API endpoints belum mendukung upload file
3. Frontend masih menggunakan simulasi API

## 🚀 **Solusi Lengkap**

### **1. Update Database Schema (Backend)**

Jalankan migration untuk menambah field YouTube:

```bash
cd ../lms-backend

# Buat migration baru
npx prisma migrate dev --name add_youtube_fields

# Atau jika sudah ada perubahan di schema.prisma, generate ulang
npx prisma generate
npx prisma db push
```

**Schema sudah diupdate dengan field:**
- `youtubeEmbedUrl` - URL video YouTube
- `youtubeVideoId` - ID video YouTube
- `youtubeThumbnailUrl` - URL thumbnail kustom
- `lessonsCount` - Jumlah pelajaran
- `totalDurationHours` - Durasi total

### **2. Buat Upload Endpoint (Backend)**

Buat file upload controller:

```typescript
// src/upload/upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: './uploads/thumbnails',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  }))
  uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `${process.env.API_URL}/uploads/thumbnails/${file.filename}`,
      filename: file.filename,
      size: file.size
    };
  }
}
```

### **3. Update Environment Variables**

Tambahkan ke `.env` (backend):

```env
# API Configuration
API_URL=http://localhost:3001

# Upload Configuration  
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

Dan ke `.env.local` (frontend):

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# YouTube API (optional)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### **4. Test dengan API yang Benar**

Ganti file `page.tsx` di manage-course untuk menggunakan implementasi API:

```typescript
// app/manage-course/page.tsx
export { default } from './page-api-integrated';
```

### **5. Test Upload Flow**

1. **Start Backend:**
   ```bash
   cd ../lms-backend
   npm run start:dev
   ```

2. **Start Frontend:**
   ```bash
   cd ../lms-high-end  
   npm run dev
   ```

3. **Test Sequence:**
   - Login sebagai TEACHER atau ADMIN
   - Klik "Buat Kursus YouTube"
   - Masukkan URL YouTube
   - Upload thumbnail kustom
   - Isi form dan submit
   - **Cek database** - data harus tersimpan

### **6. Verifikasi Database**

```sql
-- Cek tabel courses
SELECT id, title, youtubeVideoId, youtubeThumbnailUrl, published 
FROM "Course" 
ORDER BY "createdAt" DESC;

-- Cek dengan instructorId
SELECT c.*, u.name as instructor_name 
FROM "Course" c 
LEFT JOIN "User" u ON c."instructorId" = u.id 
WHERE c."youtubeVideoId" IS NOT NULL;
```

## 🛠️ **Troubleshooting**

### **Backend Tidak Jalan:**
```bash
# Install dependencies
cd ../lms-backend
npm install

# Reset database
npx prisma migrate reset
npx prisma db push
npx prisma generate
```

### **Upload Gagal:**
1. Cek folder `uploads/thumbnails` ada
2. Cek permissions folder
3. Cek network tab di browser untuk error

### **Data Tidak Tersimpan:**
1. Cek console browser untuk API errors
2. Cek console backend untuk validation errors
3. Pastikan token auth valid

## 📁 **Struktur File Baru**

```
lms-backend/src/
├── courses/
│   ├── dto/
│   │   ├── create-course.dto.ts    # ✅ Updated dengan YouTube fields
│   │   └── update-course.dto.ts    # Need update
│   ├── courses.service.ts          # Need update untuk handle YouTube
│   └── courses.controller.ts       # ✅ Already has endpoints
├── upload/                         # 🆕 New module
│   ├── upload.controller.ts        # 🆕 File upload handler
│   └── upload.module.ts            # 🆕 Upload module
└── uploads/                        # 🆕 Upload directory
    └── thumbnails/                 # 🆕 Thumbnail storage

lms-high-end/
├── hooks/
│   └── useCourseManagementAPI.ts   # ✅ Real API integration
├── app/manage-course/
│   ├── page-api-integrated.tsx     # ✅ Production-ready page
│   ├── components/
│   │   └── YouTubeComponents.tsx   # ✅ Upload components
│   └── types/
│       └── course-management.ts    # ✅ YouTube types
```

## 🎯 **Quick Fix untuk Test**

Jika ingin test cepat tanpa backend setup lengkap:

1. **Backend: Update CreateCourseDto** (manual):
   ```typescript
   // Tambah field ini di create-course.dto.ts:
   youtubeEmbedUrl?: string;
   youtubeVideoId?: string; 
   youtubeThumbnailUrl?: string;
   lessonsCount?: number;
   totalDurationHours?: number;
   ```

2. **Test dengan endpoint yang ada:**
   ```typescript
   // Test di page-api-integrated.tsx, ganti API_BASE_URL:
   const API_BASE_URL = 'http://localhost:3001';
   ```

3. **Temporary upload simulation:**
   ```typescript
   // Di useCourseManagementAPI.ts, ganti uploadYouTubeThumbnail:
   // Comment out real upload, uncomment simulation
   ```

## ✅ **Checklist Integrasi**

- [ ] Migration database berhasil
- [ ] Upload endpoint dibuat  
- [ ] Environment variables diset
- [ ] Backend bisa start tanpa error
- [ ] Frontend connect ke backend
- [ ] Upload file berhasil
- [ ] Data tersimpan di database
- [ ] Courses muncul di UI setelah create

---

**💡 Tips:** Jika ada error, cek logs backend dan frontend console untuk debugging yang efektif!

## 🎉 **Hasil Akhir**

Setelah selesai:
- ✅ Upload thumbnail YouTube berfungsi
- ✅ Data tersimpan ke PostgreSQL database  
- ✅ Role-based access (TEACHER/ADMIN only)
- ✅ Real-time UI updates
- ✅ YouTube URL parsing & validation
- ✅ File validation (size, type)
- ✅ Error handling & notifications 