// Mock database with sample data
import type { User, Course, Lesson, Enrollment, Review, Payment } from "./types"

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "student@example.com",
    password: "password123", // Mock only
    name: "John Doe",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Passionate learner interested in web development",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    email: "instructor@example.com",
    password: "password123",
    name: "Sarah Smith",
    role: "instructor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Full-stack developer with 10+ years experience",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-3",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
]

// Mock lessons
const lessonsReact: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "course-1",
    title: "Introduction to React",
    description: "Learn the basics of React and JSX",
    videoUrl: "https://example.com/videos/react-intro.mp4",
    duration: 45,
    order: 1,
    content: "This lesson covers React fundamentals...",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "lesson-2",
    courseId: "course-1",
    title: "React Hooks",
    description: "Master React Hooks like useState and useEffect",
    videoUrl: "https://example.com/videos/react-hooks.mp4",
    duration: 60,
    order: 2,
    content: "Deep dive into React Hooks...",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]

const lessonsNextJS: Lesson[] = [
  {
    id: "lesson-3",
    courseId: "course-2",
    title: "Next.js Basics",
    description: "Getting started with Next.js",
    videoUrl: "https://example.com/videos/nextjs-basics.mp4",
    duration: 50,
    order: 1,
    content: "Introduction to Next.js framework...",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "React.js Mastery",
    description: "Learn React from basics to advanced patterns and best practices.",
    instructorId: "user-2",
    instructor: mockUsers[1],
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop",
    price: 49.99,
    rating: 4.8,
    reviewCount: 245,
    studentCount: 1543,
    lessons: lessonsReact,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "course-2",
    title: "Next.js Full Stack Development",
    description: "Build full-stack applications with Next.js, covering frontend and backend.",
    instructorId: "user-2",
    instructor: mockUsers[1],
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    price: 79.99,
    rating: 4.9,
    reviewCount: 189,
    studentCount: 892,
    lessons: lessonsNextJS,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-15"),
  },
]

// Mock enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: "enrollment-1",
    userId: "user-1",
    courseId: "course-1",
    completedLessons: ["lesson-1"],
    progress: 50,
    enrolledAt: new Date("2024-01-20"),
  },
]

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: "review-1",
    courseId: "course-1",
    userId: "user-1",
    rating: 5,
    comment: "Excellent course! Very clear explanations.",
    user: mockUsers[0],
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

// Mock payments
export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    userId: "user-1",
    courseId: "course-1",
    amount: 49.99,
    status: "completed",
    transactionId: "txn-123456",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]
