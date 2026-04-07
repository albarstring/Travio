# Wireframe Descriptions

## Public Pages

### 1. Landing Page
**Layout:**
- Header: Logo, Navigation (Browse Courses, Login/Register), Search bar
- Hero Section: Large heading, CTA buttons (Jelajahi Course, Daftar Sekarang), Background gradient
- Benefits Section: 3-column grid dengan icon, title, description
- Featured Courses: Grid 3 kolom course cards dengan thumbnail, title, rating, students, price
- Testimonials: 3-column grid dengan avatar, rating stars, testimonial text, name & role
- FAQ Section: Accordion dengan pertanyaan dan jawaban
- CTA Section: Background primary color, heading, description, CTA button
- Footer: Links (Quick Links, Support, Connect), Copyright

**Key Elements:**
- Hero CTA buttons prominent
- Course cards dengan hover effect
- Smooth scroll navigation
- Responsive mobile-first design

### 2. Course Catalog Page
**Layout:**
- Header: Same as Landing Page
- Page Title: "Katalog Course" dengan description
- Filter Section: Card dengan form controls
  - Search input dengan search icon
  - Category dropdown
  - Level dropdown (Beginner/Intermediate/Advanced)
  - Sort dropdown (Terbaru, Rating, Populer, Harga)
  - Clear filters button
- Results Section:
  - Grid 3 kolom course cards
  - Pagination di bawah
- Empty State: Centered message dengan CTA button
- Footer: Same as Landing Page

**Key Elements:**
- Filter tetap visible saat scroll
- Course cards konsisten dengan Landing Page
- Loading skeleton saat fetch data
- URL params untuk filter (shareable)

### 3. Course Detail Page
**Layout:**
- Header: Same as Landing Page
- Breadcrumb: Home > Courses > Course Title
- Main Content (2-column grid):
  - Left (2/3 width):
    - Course thumbnail
    - Category badge
    - Title (large)
    - Rating, Students, Duration stats
    - Description (full text)
    - Curriculum Section: Accordion dengan list lessons
    - Instructor info (jika ada)
  - Right (1/3 width) - Sticky:
    - Price card
    - Features checklist (Lesson count, Duration, Lifetime access, Certificate)
    - CTA button (Daftar Sekarang / Lanjutkan Belajar)
    - Money-back guarantee text
- Footer: Same as Landing Page

**Key Elements:**
- Preview video untuk free lessons
- Curriculum expandable accordion
- Sticky sidebar untuk CTA
- Social share buttons (optional)

## Student Pages

### 4. Student Dashboard
**Layout:**
- Sidebar Navigation (left, fixed)
- Top Bar: User avatar, name, email
- Main Content:
  - Welcome message dengan user name
  - Stats Cards (4 cards grid):
    - Total Courses (icon, number)
    - Active Courses (icon, number)
    - Completed Courses (icon, number)
    - Overall Progress % (icon, number)
  - Recent Courses Section:
    - Section title dengan "Lihat Semua" link
    - Grid course cards dengan progress bar
  - Recent Activity Section:
    - List aktivitas dengan icon, description, timestamp

**Key Elements:**
- Stats cards dengan color coding
- Progress bars untuk course progress
- Clickable course cards
- Activity feed dengan timestamps

### 5. My Courses Page
**Layout:**
- Sidebar Navigation (same)
- Top Bar (same)
- Main Content:
  - Page title "My Courses"
  - Filter Tabs: Semua / Aktif / Selesai
  - Course Grid:
    - Course card dengan:
      - Thumbnail
      - Category badge
      - Title
      - Progress bar dengan percentage
      - Status badge (Belum Dimulai / Sedang Belajar / Selesai)
      - "Lanjutkan" button
  - Empty State: Icon, message, CTA button

**Key Elements:**
- Filter tabs untuk status
- Progress visualization
- Status badges dengan color
- Quick action buttons

### 6. Learning Page
**Layout:**
- Sidebar Navigation (collapsed/hidden saat belajar)
- Top Bar (minimal)
- Main Content (2-column):
  - Left (3/4 width):
    - Video Player (16:9 aspect ratio)
    - Lesson title (large)
    - Lesson description
    - "Tandai Selesai" button
    - Navigation buttons (Previous / Next)
  - Right (1/4 width) - Sticky:
    - Curriculum sidebar:
      - Section title "Kurikulum"
      - List lessons dengan:
        - Lesson number/checkmark
        - Lesson title
        - Duration
        - Active state highlight
        - Completed state styling

**Key Elements:**
- Full-width video player
- Lesson navigation
- Progress tracking visual
- Sidebar scrollable untuk banyak lessons
- Notes section (optional, expandable)

### 7. Quiz Page
**Layout:**
- Sidebar Navigation (same)
- Top Bar dengan timer (sticky)
- Main Content:
  - Quiz header card:
    - Quiz title
    - Timer countdown (prominent)
    - Description
  - Questions list:
    - Question card:
      - Question number badge
      - Question text
      - Points badge
      - Answer options (radio buttons untuk multiple choice)
      - Selected state highlight
  - Submit button (fixed bottom atau end of page)

**Key Elements:**
- Timer countdown dengan warning colors
- Question numbering
- Answer selection visual feedback
- Disabled state setelah submit
- Results display (jika sudah submit)

## Admin Pages

### 8. Admin Dashboard
**Layout:**
- Sidebar Navigation (Admin menu)
- Top Bar: Admin name
- Main Content:
  - Page title "Admin Dashboard"
  - Stats Cards (4 cards):
    - Total Users
    - Total Courses
    - Total Transactions
    - Total Revenue
  - Recent Courses Table:
    - Columns: Course, Category, Students, Status
    - Action buttons (Edit, Delete)
  - Recent Transactions Table:
    - Columns: User, Course, Amount, Status
    - Action buttons (Approve, Reject)

**Key Elements:**
- Stats dengan icons
- Data tables dengan sorting
- Action buttons untuk quick actions
- Status badges

### 9. Course Management Page
**Layout:**
- Sidebar Navigation (same)
- Top Bar (same)
- Main Content:
  - Page title dengan "Add New Course" button
  - Courses Table:
    - Columns: Thumbnail, Title, Category, Students, Status, Actions
    - Search/filter bar
    - Pagination
  - Modal untuk Create/Edit:
    - Form fields (title, slug, description, price, category, level, thumbnail upload)
    - Publish toggle
    - Save/Cancel buttons

**Key Elements:**
- CRUD operations
- Image upload preview
- Form validation
- Status indicators

### 10. User Management Page
**Layout:**
- Sidebar Navigation (same)
- Top Bar (same)
- Main Content:
  - Page title
  - Users Table:
    - Columns: Name, Email, Courses, Transactions, Status, Actions
    - Search bar
    - Filter by status
  - Action buttons:
    - Activate/Deactivate user
    - View user details

**Key Elements:**
- User status toggle
- Search functionality
- User statistics display

