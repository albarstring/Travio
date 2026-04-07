import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import CourseCatalogPage from './pages/public/CourseCatalogPage'
import CourseDetailPage from './pages/public/CourseDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import MyCoursesPage from './pages/student/MyCoursesPage'
import LearningPage from './pages/student/LearningPage'
import LearningActivityPage from './pages/student/LearningActivityPage'
import QuizPage from './pages/student/QuizPage'
import CertificatesPage from './pages/student/CertificatesPage'
import TransactionHistoryPage from './pages/student/TransactionHistoryPage'
import ProfilePage from './pages/student/ProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminCoursesPage from './pages/admin/CoursesPage'
import AdminLessonsPage from './pages/admin/LessonsPage'
import AdminCategoriesPage from './pages/admin/CategoriesPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminTransactionsPage from './pages/admin/TransactionsPage'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/student/dashboard" /> : <RegisterPage />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Student Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCoursesPage />} />
        <Route path="/student/learn/:courseId" element={<LearningPage />} />
        <Route path="/student/learn/:courseId/lesson/:lessonId" element={<LearningPage />} />
        <Route path="/student/activity" element={<LearningActivityPage />} />
        <Route path="/student/quiz/:quizId" element={<QuizPage />} />
        <Route path="/student/certificates" element={<CertificatesPage />} />
        <Route path="/student/transactions" element={<TransactionHistoryPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/courses/:courseId/lessons" element={<AdminLessonsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

