# Sitemap & User Flow

## Sitemap Struktur

### Public Pages
```
/
├── / (Landing Page)
├── /courses (Course Catalog)
├── /courses/:slug (Course Detail)
├── /login
├── /register
├── /forgot-password
└── /reset-password?token=xxx
```

### Student Pages (Protected)
```
/student/
├── /dashboard (Overview dengan statistik)
├── /courses (My Courses - aktif & selesai)
├── /learn/:courseId (Learning Page)
├── /learn/:courseId/lesson/:lessonId (Learning Page dengan lesson spesifik)
├── /activity (Learning Activity & History)
├── /quiz/:quizId (Quiz & Assessment)
├── /certificates (Certificates)
├── /transactions (Transaction History)
└── /profile (Profile & Settings)
```

### Admin Pages (Protected - Admin Only)
```
/admin/
├── /dashboard (Admin Dashboard dengan analytics)
├── /courses (Course Management - CRUD)
├── /courses/:courseId/lessons (Lesson Management)
├── /categories (Category Management)
├── /users (User Management)
└── /transactions (Transaction Management)
```

## User Flow

### Student Flow

#### Registration & Login Flow
1. User mengakses Landing Page
2. Klik "Daftar Sekarang" → Register Page
3. Isi form registrasi (nama, email, password)
4. Submit → Auto login → Redirect ke Student Dashboard
5. Atau klik "Login" → Login Page → Masuk → Redirect ke Dashboard

#### Course Enrollment Flow
1. User browsing Course Catalog (dengan filter/search)
2. Klik course card → Course Detail Page
3. Baca deskripsi, lihat kurikulum, preview video
4. Klik "Daftar Sekarang"
   - Jika gratis → Langsung enroll → Redirect ke Learning Page
   - Jika berbayar → Create transaction → Redirect ke Transaction History
5. Upload bukti pembayaran (jika berbayar)
6. Admin approve → Auto enroll → Bisa mulai belajar

#### Learning Flow
1. Dari Dashboard/My Courses → Klik course
2. Masuk ke Learning Page dengan lesson pertama
3. Tonton video, baca materi
4. Tandai lesson selesai → Progress update
5. Navigasi ke lesson berikutnya (Next/Previous)
6. Setelah semua lesson selesai → Bisa ambil quiz
7. Setelah quiz lulus → Dapat sertifikat

### Admin Flow

#### Course Management Flow
1. Login sebagai Admin → Admin Dashboard
2. Klik "Courses" → Course Management Page
3. Create Course:
   - Klik "Add New Course"
   - Isi form (title, description, price, category, level)
   - Upload thumbnail
   - Save → Course created (draft)
4. Manage Lessons:
   - Klik course → Manage Lessons
   - Add Lesson (title, description, video, order)
   - Upload video
   - Set order/urutan lesson
5. Publish Course:
   - Set status ke "Published"
   - Course muncul di public catalog

#### Transaction Management Flow
1. Admin Dashboard → Transactions
2. Lihat daftar transaksi (Pending, Paid, Failed)
3. Untuk transaksi Pending:
   - Review bukti pembayaran
   - Approve → Status jadi "Paid" → Auto enroll user ke course
   - Reject → Status jadi "Failed"

## Navigation Structure

### Public Navigation
- Logo → Home
- Browse Courses → Course Catalog
- Login/Register buttons
- Search bar (jika logged in)

### Student Navigation (Sidebar)
- Overview (Dashboard)
- My Courses
- Learning Activity
- Quiz & Assessment
- Certificates
- Transaction History
- Profile & Settings
- Logout

### Admin Navigation (Sidebar)
- Dashboard
- Courses
- Categories
- Users
- Transactions
- Logout

