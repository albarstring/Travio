import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { BookOpen, Clock, Award, TrendingUp, ArrowRight } from 'lucide-react'
import CourseCard from '../../components/common/CourseCard'

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    api
      .get('/users/dashboard')
      .then((res) => {
        setDashboardData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return <Loading />
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>
  }

  const { stats, recentEnrollments, recentActivities } = dashboardData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-base-content/70">
          Selamat datang kembali, {user?.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Course Aktif</p>
                <p className="text-2xl font-bold">{stats.activeCourses}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-success" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Course Selesai</p>
                <p className="text-2xl font-bold">{stats.completedCourses}</p>
              </div>
              <Award className="w-10 h-10 text-warning" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Progress Keseluruhan</p>
                <p className="text-2xl font-bold">{stats.overallProgress}%</p>
              </div>
              <Clock className="w-10 h-10 text-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Course Terbaru</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/student/courses')}
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {recentEnrollments && recentEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="card bg-base-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    navigate(`/student/learn/${enrollment.courseId}`)
                  }
                >
                  <figure>
                    <img
                      src={enrollment.course.thumbnail || '/placeholder-course.jpg'}
                      alt={enrollment.course.title}
                      className="w-full h-32 object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm line-clamp-2">
                      {enrollment.course.title}
                    </h3>
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-base-content/60">
                      {enrollment.progress}% selesai
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-base-content/60">
                Belum ada course yang diikuti
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => navigate('/courses')}
              >
                Jelajahi Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-4">Aktivitas Terbaru</h2>
          {recentActivities && recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-base-200"
                >
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-base-content/60">
                      {new Date(activity.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base-content/60 text-center py-4">
              Belum ada aktivitas
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

