# Diagram Alur Aplikasi E-Learning Platform

## 📊 Struktur Data Hierarchy

```
Course
│
├── Metadata
│   ├── title, description, category
│   ├── price, level (Beginner/Intermediate/Advanced)
│   ├── thumbnail, videoUrl (preview)
│   └── isPublished
│
└── Sections (Pengelompokan Materi)
    │
    ├── Section 1: "Pengenalan"
    │   ├── isPreview: true/false
    │   ├── order: 1
    │   └── Lessons
    │       ├── Lesson 1.1: "Apa itu..."
    │       │   ├── videoUrl (YouTube)
    │       │   ├── isPreview: true/false
    │       │   └── order: 1
    │       ├── Lesson 1.2: "Konsep Dasar..."
    │       └── Lesson 1.3: "Praktik Awal..."
    │
    ├── Section 2: "Pembelajaran Dasar"
    │   └── Lessons...
    │
    └── Section 3: "Studi Lanjutan"
        └── Lessons...
```

---

## 🔄 Alur Instructor: Membuat Course

```
[Start]
    │
    ▼
[Login sebagai Instructor]
    │
    ▼
[Instructor Dashboard]
    │
    ├─→ [View My Courses]
    │       ├─→ Edit Course
    │       ├─→ View Analytics
    │       └─→ Delete Course
    │
    └─→ [Create New Course]
            │
            ▼
        [Form: Course Information]
            ├─→ Title, Description
            ├─→ Category, Level
            ├─→ Price, Thumbnail
            └─→ YouTube Preview URL (optional)
            │
            ▼
        [Click "Create"]
            │
            ▼
        [Edit Course Page]
            │
            ├─→ Tab: Course Info
            │   └─→ Edit basic info
            │
            ├─→ Tab: Structure ⭐
            │   │
            │   ├─→ [Add Section]
            │   │   ├─→ Section Title
            │   │   ├─→ Section Description
            │   │   └─→ Toggle "Free Preview"
            │   │
            │   └─→ [For Each Section]
            │       │
            │       ├─→ [Add Lesson]
            │       │   ├─→ Lesson Title
            │       │   ├─→ Lesson Description
            │       │   ├─→ YouTube Video URL
            │       │   ├─→ Duration (minutes)
            │       │   ├─→ Content/Text (optional)
            │       │   └─→ Toggle "Free Preview"
            │       │
            │       ├─→ [Edit Lesson]
            │       │
            │       ├─→ [Delete Lesson]
            │       │
            │       └─→ [Drag & Drop] (reorder lessons)
            │
            ├─→ Tab: Preview
            │   └─→ Preview course seperti student
            │
            └─→ Tab: Settings
                ├─→ Toggle "Publish Course"
                └─→ Delete Course
                │
                ▼
            [Course Published]
                └─→ Course muncul di katalog
```

---

## 🎓 Alur Student: Belajar Course

```
[Start]
    │
    ▼
[Login sebagai Student]
    │
    ▼
[Browse Courses]
    │
    ├─→ Filter & Search
    │   ├─→ Category
    │   ├─→ Level
    │   ├─→ Price
    │   └─→ Rating
    │
    └─→ [Click Course Card]
            │
            ▼
        [Course Detail Page]
            │
            ├─→ Tab: Overview
            │   ├─→ Preview Video (YouTube)
            │   ├─→ Description
            │   ├─→ Learning Outcomes
            │   └─→ Instructor Info
            │
            ├─→ Tab: Curriculum ⭐
            │   │
            │   └─→ [Course Structure View]
            │       │
            │       ├─→ Section 1: "Pengenalan" [PREVIEW BADGE]
            │       │   ├─→ ✓ Lesson 1.1 [FREE]
            │       │   ├─→ ✓ Lesson 1.2 [FREE]
            │       │   └─→ ✓ Lesson 1.3 [FREE]
            │       │
            │       ├─→ Section 2: "Pembelajaran Dasar"
            │       │   ├─→ 🔒 Lesson 2.1 [LOCKED]
            │       │   └─→ 🔒 Lesson 2.2 [LOCKED]
            │       │
            │       └─→ Section 3: "Studi Lanjutan"
            │           └─→ 🔒 Lesson 3.1 [LOCKED]
            │
            └─→ Sidebar
                ├─→ Price
                ├─→ Stats (duration, lessons)
                └─→ [Enroll Now Button]
                    │
                    ▼
                [Checkout Page]
                    ├─→ Review Course
                    ├─→ Payment Method
                    └─→ [Complete Purchase]
                        │
                        ▼
                    [Payment Processing]
                        │
                        ▼
                    [Auto Enrollment]
                        │
                        ▼
                    [Redirect to Course Player]
                        │
                        ▼
                    [Course Player Page] ⭐
                        │
                        ├─→ Header
                        │   ├─→ Course Title
                        │   └─→ Progress Bar (0-100%)
                        │
                        ├─→ Left Sidebar
                        │   │
                        │   └─→ [Section List]
                        │       │
                        │       ├─→ Section 1 [▼ Expand]
                        │       │   ├─→ ✓ Lesson 1.1 [COMPLETED]
                        │       │   ├─→ ▶ Lesson 1.2 [CURRENT]
                        │       │   └─→ ○ Lesson 1.3 [NOT STARTED]
                        │       │
                        │       ├─→ Section 2 [▶ Collapse]
                        │       └─→ Section 3 [▶ Collapse]
                        │
                        └─→ Main Content
                            │
                            ├─→ [YouTube Video Player]
                            │   └─→ Current Lesson Video
                            │
                            ├─→ Lesson Info Card
                            │   ├─→ Title
                            │   ├─→ Description
                            │   └─→ Duration
                            │
                            ├─→ [Mark as Complete Button]
                            │   └─→ Updates progress
                            │
                            └─→ Navigation
                                ├─→ [Previous Lesson]
                                └─→ [Next Lesson]
                        │
                        ▼
                    [Progress Tracking]
                        │
                        ├─→ Lesson Level: Complete/Incomplete
                        ├─→ Section Level: Progress %
                        └─→ Course Level: Overall Progress %
                        │
                        ▼
                    [Dashboard: My Courses]
                        ├─→ Progress Cards
                        ├─→ Continue Learning CTA
                        └─→ Completion Badge (if 100%)
```

---

## 🔐 Preview System Logic Flow

```
Student mengakses Course Detail Page
    │
    ▼
[Check: Is Student Enrolled?]
    │
    ├─→ YES → Show ALL content (unlocked)
    │
    └─→ NO
        │
        ▼
    [Check: Is Section Preview?]
        │
        ├─→ YES → Show ALL lessons in section (unlocked)
        │
        └─→ NO
            │
            ▼
        [Check: Is Individual Lesson Preview?]
            │
            ├─→ YES → Show only that lesson (unlocked)
            │
            └─→ NO → Show LOCKED state
```

**Visual Indicators:**
- ✅ **Unlocked**: Green checkmark or play icon
- 🔒 **Locked**: Lock icon, grayed out
- 🎁 **Preview Badge**: "FREE PREVIEW" badge on section/lesson
- ▶️ **Current**: Highlighted with primary color

---

## 📈 Progress Calculation Flow

```
Course Progress Calculation:
    │
    ├─→ Get all sections in course
    │
    ├─→ For each section:
    │   │
    │   ├─→ Count total lessons in section
    │   │
    │   ├─→ Count completed lessons in section
    │   │
    │   └─→ Section Progress = (completed / total) × 100
    │
    ├─→ Count total lessons in course
    │
    ├─→ Count total completed lessons (across all sections)
    │
    └─→ Course Progress = (total completed / total lessons) × 100

Example:
    Course has 10 lessons total
    Student completed 7 lessons
    Progress = (7 / 10) × 100 = 70%
```

---

## 🎯 User Journey: Complete Learning Path

### Instructor Journey
```
1. Register/Login as Instructor
2. Create Course (basic info)
3. Add Sections (organize content)
4. Add Lessons to each Section (with YouTube videos)
5. Set Preview options (which sections/lessons are free)
6. Preview Course
7. Publish Course
8. Monitor Analytics (students, progress, revenue)
```

### Student Journey
```
1. Register/Login as Student
2. Browse Course Catalog
3. View Course Detail (see preview content)
4. Purchase Course
5. Auto-enroll in Course
6. Access Course Player
7. Watch Videos (YouTube embedded)
8. Mark Lessons Complete
9. Track Progress (section & overall)
10. Complete Course (100% progress)
11. Get Certificate (future feature)
```

---

## 🔄 State Transitions

### Course State Machine
```
[Draft]
    │
    ├─→ Edit → [Draft] (loop)
    │
    └─→ Publish → [Published]
            │
            ├─→ Unpublish → [Draft]
            │
            └─→ Delete → [Deleted]
```

### Enrollment State Machine
```
[Not Enrolled]
    │
    ├─→ Purchase → [Enrolled]
    │       │
    │       ├─→ Watch Lessons → [In Progress]
    │       │       │
    │       │       ├─→ Complete Lessons → [In Progress]
    │       │       │
    │       │       └─→ Complete All → [Completed]
    │       │
    │       └─→ Cancel Enrollment → [Not Enrolled]
    │
    └─→ Preview Content → [Previewing]
            │
            └─→ Purchase → [Enrolled]
```

---

## 📱 Page Structure Overview

```
/app
├── /instructor (Instructor Pages)
│   ├── /courses
│   │   ├── /new (Create Course)
│   │   └── /[id]
│   │       ├── /edit (Edit Course Structure) ⭐
│   │       └── /analytics
│   └── (Dashboard)
│
├── /courses (Public Course Pages)
│   ├── (Catalog/Browse)
│   └── /[id] (Course Detail)
│       ├── Tab: Overview
│       └── Tab: Curriculum ⭐
│
├── /checkout (Purchase Flow)
│   └── /[courseId]
│
└── /dashboard (Student Pages)
    ├── (My Courses Dashboard)
    └── /courses
        └── /[id] (Course Player) ⭐
            ├── Sidebar: Section/Lesson Navigator
            └── Main: Video Player + Lesson Info
```

---

## 🎨 UI Components Needed

### Instructor Components
- ✅ CourseForm (create/edit course info)
- ⏳ SectionManager (add/edit/delete sections)
- ⏳ LessonManager (add/edit/delete lessons within section)
- ⏳ DragDropList (reorder sections/lessons)
- ⏳ PreviewToggle (mark section/lesson as preview)
- ⏳ CoursePreview (preview course as student)

### Student Components
- ✅ CourseCard (course catalog item)
- ⏳ CourseDetailTabs (Overview & Curriculum)
- ✅ CurriculumTree (section/lesson structure with locked/unlocked states)
- ✅ CoursePlayer (main learning interface)
- ⏳ SectionNavigator (sidebar with expandable sections)
- ✅ ProgressBar (section & course level)
- ✅ LessonCompletionButton
- ⏳ LockedLessonIndicator

---

**Legend:**
- ✅ = Already Implemented
- ⏳ = Needs Implementation
- ⭐ = Critical Feature

