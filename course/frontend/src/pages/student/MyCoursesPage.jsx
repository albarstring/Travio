import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { BookOpen, Play } from 'lucide-react'

const MyCoursesPage = () => {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, completed

  useEffect(() => {
    api
      .get('/enrollments', { params: filter !== 'all' ? { status: filter } : {} })
      .then((res) => {
        setEnrollments(res.data.enrollments)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [filter])

  if (loading) {
    return <Loading />
  }

  const filteredEnrollments =
    filter === 'all'
      ? enrollments
      : enrollments.filter((e) => e.status === filter.toUpperCase())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-base-content/70">
            Kelola dan lanjutkan pembelajaran Anda
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Semua
        </button>
        <button
          className={`tab ${filter === 'active' ? 'tab-active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktif
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'tab-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Selesai
        </button>
      </div>

      {/* Courses List */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/learn/${enrollment.courseId}`)}
            >
              <figure>
                <img
                  src={enrollment.course.thumbnail || '/placeholder-course.jpg'}
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="badge badge-primary badge-sm">
                  {enrollment.course.category?.name}
                </div>
                <h2 className="card-title text-lg line-clamp-2">
                  {enrollment.course.title}
                </h2>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-base-content/60">
                    {enrollment.progress}% selesai
                  </span>
                  <span
                    className={`badge ${
                      enrollment.status === 'COMPLETED'
                        ? 'badge-success'
                        : enrollment.status === 'IN_PROGRESS'
                        ? 'badge-warning'
                        : 'badge-ghost'
                    }`}
                  >
                    {enrollment.status === 'COMPLETED'
                      ? 'Selesai'
                      : enrollment.status === 'IN_PROGRESS'
                      ? 'Sedang Belajar'
                      : 'Belum Dimulai'}
                  </span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/student/learn/${enrollment.courseId}`)
                    }}
                  >
                    <Play className="w-4 h-4" />
                    Lanjutkan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <p className="text-xl text-base-content/70 mb-4">
              Belum ada course yang diikuti
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/courses')}
            >
              Jelajahi Course
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCoursesPage

