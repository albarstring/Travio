// Database schema types for the e-learning platform

export type UserRole = "student" | "instructor" | "admin"

export interface User {
  id: string
  email: string
  password: string // In production, this would be hashed
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
  isVerified?: boolean
  isActive?: boolean
  isApproved?: boolean
  violationCount?: number
  lastViolationAt?: Date
}

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructor?: User
  category: string
  thumbnail?: string
  videoUrl?: string
  price: number
  level?: string // "Beginner" | "Intermediate" | "Advanced"
  rating: number
  reviewCount: number
  studentCount: number
  isPublished?: boolean
  sections?: Section[]
  lessons?: Lesson[] // Deprecated: use sections instead
  createdAt: Date
  updatedAt: Date
}

export interface Section {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  isPreview: boolean
  lessons?: Lesson[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  sectionId: string
  section?: Section
  courseId?: string // Deprecated: use sectionId instead
  title: string
  description: string
  videoUrl: string
  duration: number // in minutes
  order: number
  content?: string
  isPreview: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  user?: User
  course?: Course
  completedLessons: string[] // lesson IDs
  progress: number // 0-100
  enrolledAt: Date
  completedAt?: Date
}

export interface Review {
  id: string
  courseId: string
  userId: string
  rating: number // 1-5
  comment: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  userId: string
  courseId: string
  amount: number
  status: "pending" | "completed" | "failed"
  paymentMethod?: string
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  passingScore: number
  isPublished: boolean
  questions?: QuizQuestion[]
  createdAt: Date
  updatedAt: Date
}

export interface QuizQuestion {
  id: string
  quizId: string
  title: string
  description?: string
  type: "multiple-choice" | "true-false" | "short-answer"
  order: number
  answers?: QuizAnswer[]
  createdAt: Date
  updatedAt: Date
}

export interface QuizAnswer {
  id: string
  questionId: string
  text: string
  isCorrect: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  score?: number
  totalPoints: number
  earnedPoints: number
  passed?: boolean
  responses?: Record<string, string>
  startedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

