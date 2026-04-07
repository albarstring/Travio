# Dokumentasi Alur dan Struktur Aplikasi E-Learning Platform

## 📋 Daftar Isi
1. [Overview Sistem](#overview-sistem)
2. [Struktur Database](#struktur-database)
3. [Alur Instructor](#alur-instructor)
4. [Alur Student](#alur-student)
5. [Fitur Utama](#fitur-utama)
6. [Roadmap Implementasi](#roadmap-implementasi)

---

## 🎯 Overview Sistem

### Peran Pengguna
1. **Instructor**: Membuat, mengelola, dan mempublikasikan course
2. **Student**: Membeli course, belajar, dan tracking progress

### Arsitektur Data
```
Course
  ├── Section 1 (Contoh: "Pengenalan")
  │   ├── Lesson 1.1
  │   ├── Lesson 1.2
  │   └── Lesson 1.3
  ├── Section 2 (Contoh: "Pembelajaran Dasar")
  │   ├── Lesson 2.1
  │   └── Lesson 2.2
  └── Section 3 (Contoh: "Studi Lanjutan")
      └── Lesson 3.1
```

---

## 🗄️ Struktur Database

### Model Course (Updated)
```prisma
model Course {
  id            String   @id @default(cuid())
  title         String
  description   String
  instructorId  String
  instructor    User     @relation("InstructorCourses", fields: [instructorId], references: [id])
  category      String
  thumbnail     String?
  videoUrl      String?  // YouTube URL untuk preview course
  price         Float
  level         String   // "Beginner" | "Intermediate" | "Advanced"
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  studentCount  Int      @default(0)
  isPublished   Boolean  @default(false) // Status publikasi
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sections      Section[]
  enrollments   Enrollment[]
  reviews       Review[]
  payments      Payment[]

  @@map("courses")
}
```

### Model Section (NEW)
```prisma
model Section {
  id            String   @id @default(cuid())
  courseId      String
  course        Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title         String
  description   String?
  order         Int      // Urutan section dalam course
  isPreview     Boolean  @default(false) // Section gratis/preview
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  lessons       Lesson[]

  @@map("sections")
}
```

### Model Lesson (Updated)
```prisma
model Lesson {
  id          String   @id @default(cuid())
  sectionId   String   // Relasi ke Section, bukan langsung ke Course
  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  title       String
  description String
  videoUrl    String   // YouTube URL (required)
  duration    Int      // dalam menit
  order       Int      // Urutan lesson dalam section
  content     String?  // Teks/materi tambahan (opsional)
  isPreview   Boolean  @default(false) // Lesson gratis/preview
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("lessons")
}
```

### Model Enrollment (Updated)
```prisma
model Enrollment {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId         String
  course           Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  completedLessons Json     // JSON array of lesson IDs yang sudah selesai
  progress         Float    @default(0) // 0-100
  enrolledAt       DateTime @default(now())
  completedAt      DateTime?

  @@unique([userId, courseId])
  @@map("enrollments")
}
```

---

## 👨‍🏫 Alur Instructor

### 1. Membuat Course Baru
```
Instructor Dashboard
  → Klik "Create New Course"
  → Form Course Information:
     - Judul Course
     - Deskripsi (rich text editor)
     - Kategori
     - Level (Beginner/Intermediate/Advanced)
     - Harga
     - Thumbnail (image upload)
     - YouTube Preview Video URL (opsional)
  → Klik "Create Course"
  → Redirect ke "Edit Course" page
```

### 2. Membuat Struktur Section & Lesson
```
Edit Course Page
  → Tab "Course Structure"
  
  → Tambah Section:
     - Klik "Add Section"
     - Form Section:
       * Judul Section (contoh: "Pengenalan", "Pembelajaran Dasar")
       * Deskripsi Section (opsional)
       * Toggle "Free Preview" (jika section ini gratis)
     - Urutan Section bisa di-drag & drop
  
  → Tambah Lesson ke Section:
     - Pilih Section
     - Klik "Add Lesson" di dalam Section
     - Form Lesson:
       * Judul Lesson
       * Deskripsi singkat
       * YouTube Video URL (required)
       * Durasi (menit)
       * Content/Teks materi (opsional, rich text)
       * Toggle "Free Preview" (jika lesson ini gratis)
     - Urutan Lesson bisa di-drag & drop
  
  → Edit/Delete Section:
     - Klik icon edit pada Section
     - Atau klik icon delete (akan delete semua lessons di dalamnya)
  
  → Edit/Delete Lesson:
     - Klik icon edit pada Lesson
     - Atau klik icon delete
```

### 3. Preview & Publish Course
```
Edit Course Page
  → Tab "Preview"
     - Melihat preview course seperti student melihat
     - Test semua video YouTube
  
  → Tab "Settings"
     - Toggle "Publish Course"
     - Setelah publish, course muncul di katalog
```

### 4. Manajemen Course
```
Instructor Dashboard
  → Daftar Course:
     - Course Draft (belum publish)
     - Course Published
     - Course dengan stats (student count, rating, revenue)
  
  → Aksi per Course:
     - Edit Course
     - View Analytics
     - Duplicate Course
     - Archive/Delete Course
```

---

## 👨‍🎓 Alur Student

### 1. Browse & Detail Course
```
Courses Page (Katalog)
  → Filter & Search:
     - Kategori
     - Level
     - Harga (Free/Paid)
     - Rating
     - Search by keyword
  
  → Course Card menampilkan:
     - Thumbnail
     - Judul
     - Instructor name
     - Rating & Review count
     - Price
     - Student count
     - Level badge

Course Detail Page
  → Tab "Overview":
     - Course preview video (YouTube embedded)
     - Deskripsi lengkap
     - Learning outcomes
     - Prasyarat
     - Instructor info
  
  → Tab "Curriculum":
     - Struktur Course:
       * Section 1 (Preview badge jika gratis)
         - Lesson 1.1 (Preview badge jika gratis)
         - Lesson 1.2 (Locked icon jika belum beli)
       * Section 2
         - Lesson 2.1 (Locked)
         - Lesson 2.2 (Locked)
     - Total duration
     - Total lessons count
  
  → Sidebar:
     - Price
     - "Enroll Now" button
     - Course stats
```

### 2. Purchase & Enrollment
```
Course Detail Page
  → Klik "Enroll Now"
  → Redirect ke Checkout Page
  
Checkout Page
  → Review course info
  → Select payment method
  → Klik "Complete Purchase"
  → Payment processing
  → Auto-enrollment
  → Redirect ke Course Player Page
```

### 3. Learning Experience
```
Course Player Page (/dashboard/courses/[id])
  → Layout:
     - Header: Course title, progress bar
     - Left Sidebar: Section & Lesson list (dengan progress indicators)
     - Main Content: Video player area
  
  → Video Player:
     - YouTube embedded iframe
     - Lesson title & description
     - Previous/Next lesson buttons
     - "Mark as Complete" button
  
  → Sidebar Lesson List:
     - Expandable Sections
     - Lesson items dengan:
       * Checkmark (completed)
       * Play icon (current)
       * Lock icon (locked - untuk preview lesson yang belum di-enroll)
       * Duration
     - Progress indicator per section
     - Overall course progress
  
  → Features:
     - Auto-save progress
     - Resume dari last watched lesson
     - Notes/Timestamp (future feature)
```

### 4. Progress Tracking
```
Student Dashboard
  → "My Courses" Section:
     - Enrolled courses dengan:
       * Progress bar (0-100%)
       * Last accessed date
       * "Continue Learning" button
       * Completion badge (jika 100%)
  
  → Course Progress Detail:
     - Per section progress
     - Completed lessons count / Total lessons
     - Time spent
     - Certificate (jika selesai)
```

---

## 🎨 Fitur Utama

### 1. Course Management (Instructor)
- ✅ Create/Edit/Delete Course
- ✅ Course Information (title, description, price, level, category)
- ✅ Course Preview Video (YouTube)
- ✅ Section Management (drag & drop ordering)
- ✅ Lesson Management (drag & drop ordering)
- ✅ Preview Toggle (per Section & Lesson)
- ✅ Course Publishing
- ✅ Course Analytics (student count, completion rate)

### 2. Learning Experience (Student)
- ✅ Course Catalog (filter, search)
- ✅ Course Detail Page
- ✅ Curriculum Preview (dengan locked/unlocked indicators)
- ✅ Purchase & Checkout
- ✅ Course Player (YouTube embedded)
- ✅ Progress Tracking (per lesson, per section, overall)
- ✅ Resume Learning (last watched lesson)
- ✅ Mark Lesson Complete

### 3. Preview System
- ✅ Section-level preview (all lessons in section free)
- ✅ Lesson-level preview (individual lesson free)
- ✅ Preview content accessible tanpa purchase
- ✅ Locked content hanya untuk enrolled students

### 4. Progress & Analytics
- ✅ Lesson completion tracking
- ✅ Section progress calculation
- ✅ Overall course progress (0-100%)
- ✅ Student dashboard dengan progress overview
- ✅ Instructor analytics dashboard

---

## 🚀 Roadmap Implementasi

### Phase 1: Database & Backend (Priority: High)
1. ✅ Update Prisma schema:
   - Add `Section` model
   - Update `Lesson` model (add `sectionId`, remove `courseId`)
   - Update `Course` model (add `level`, `isPublished`)
   - Update `Section` & `Lesson` dengan field `isPreview`

2. ✅ Migration database:
   - Create migration untuk Section
   - Migrate existing lessons ke section structure

3. ✅ API Endpoints:
   - `GET/POST/PUT/DELETE /api/courses/[id]/sections`
   - `GET/POST/PUT/DELETE /api/sections/[id]/lessons`
   - Update course endpoints untuk include sections
   - Update enrollment progress calculation

### Phase 2: Instructor Features (Priority: High)
1. ✅ Course Creation Form:
   - Add level field
   - Add publish toggle

2. ✅ Section Management UI:
   - Add/Edit/Delete Section
   - Drag & drop ordering
   - Preview toggle per section

3. ✅ Lesson Management UI:
   - Add/Edit/Delete Lesson (dalam section)
   - Drag & drop ordering
   - Preview toggle per lesson
   - YouTube URL validation

### Phase 3: Student Features (Priority: High)
1. ✅ Course Detail Page:
   - Curriculum tab dengan section/lesson structure
   - Preview indicators (badges)
   - Locked/unlocked states

2. ✅ Course Player Page:
   - Section/Lesson sidebar navigation
   - YouTube embedded player
   - Progress tracking
   - Mark complete functionality

3. ✅ Student Dashboard:
   - Course progress cards
   - Continue learning CTA
   - Progress visualization

### Phase 4: Enhancement (Priority: Medium)
1. ⏳ Advanced Features:
   - Course duplication
   - Bulk lesson operations
   - Course templates
   - Student notes & bookmarks

2. ⏳ Analytics:
   - Instructor analytics dashboard
   - Student learning insights
   - Completion reports

3. ⏳ Certificates:
   - Auto-generate certificate on completion
   - Download certificate

---

## 📝 Notes & Best Practices

### YouTube Integration
- Validasi URL YouTube sebelum save
- Extract video ID untuk consistency
- Handle YouTube privacy/restrictions
- Error handling untuk deleted videos

### Preview System Logic
```
If (student enrolled):
  → Show all content
  
Else if (section.isPreview):
  → Show all lessons in section
  
Else if (lesson.isPreview):
  → Show only preview lessons
  
Else:
  → Show locked state
```

### Progress Calculation
```
Section Progress = (Completed lessons in section / Total lessons in section) * 100
Course Progress = (Total completed lessons / Total lessons) * 100
```

### Ordering System
- Use `order` field (integer) untuk sorting
- Implement drag & drop UI untuk reordering
- Auto-update order values saat drag & drop

---

## 🔗 Related Files

- Database Schema: `prisma/schema.prisma`
- Course API: `app/api/courses/`
- Section API: `app/api/courses/[id]/sections/` (to be created)
- Lesson API: `app/api/sections/[id]/lessons/` (to be created)
- Instructor Pages: `app/instructor/`
- Student Pages: `app/dashboard/`, `app/courses/`

---

**Last Updated**: [Current Date]
**Version**: 1.0.0

