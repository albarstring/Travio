import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourse } from '../../store/slices/courseSlice'
import Loading from '../../components/common/Loading'
import { Star, Users, Clock, CheckCircle, Play, BookOpen } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CourseDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentCourse, isLoading } = useSelector((state) => state.course)
  const { user } = useSelector((state) => state.auth)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    dispatch(fetchCourse(slug))
  }, [dispatch, slug])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setEnrolling(true)
    try {
      if (currentCourse.price > 0) {
        // Create transaction
        await api.post('/transactions', {
          courseId: currentCourse.id,
          amount: currentCourse.price,
          paymentMethod: 'MANUAL',
        })
        toast.success('Transaksi berhasil dibuat. Silakan lakukan pembayaran.')
        navigate('/student/transactions')
      } else {
        // Free course - enroll directly
        await api.post('/enrollments', {
          courseId: currentCourse.id,
        })
        toast.success('Berhasil mendaftar course!')
        navigate(`/student/learn/${currentCourse.id}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftar course')
    } finally {
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!currentCourse) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Course tidak ditemukan</p>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">{currentCourse.category?.name || 'Course'}</div>
            <h1 className="text-4xl font-bold text-slate-900">{currentCourse.title}</h1>
            <p className="text-lg text-slate-600">
              {currentCourse.shortDescription || currentCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-warning text-warning" />
                <span className="font-semibold text-slate-900">
                  {currentCourse.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-slate-500">
                  ({currentCourse.totalRatings || 0} rating)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{currentCourse.totalStudents || 0} siswa</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{Math.floor((currentCourse.duration || 0) / 60)} jam</span>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-7">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Tentang course ini</h2>
            <div className="prose max-w-none text-slate-700">
              <p className="whitespace-pre-line">{currentCourse.description}</p>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-7">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Kurikulum course</h2>
            <div className="space-y-2">
              {currentCourse.lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{lesson.title}</p>
                    <p className="text-xs text-slate-500">
                      {Math.floor((lesson.duration || 0) / 60)} menit
                      {lesson.isPreview && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          Preview
                        </span>
                      )}
                    </p>
                  </div>
                  {lesson.isPreview && <Play className="h-5 w-5 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-6 p-6 md:p-7 space-y-5">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {currentCourse.price > 0 ? formatPrice(currentCourse.price) : 'Gratis'}
              </div>
              {currentCourse.price > 0 && (
                <p className="text-sm text-slate-500">Bayar sekali, akses seumur hidup.</p>
              )}
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{currentCourse.totalLessons || 0} lesson</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{Math.floor((currentCourse.duration || 0) / 60)} jam konten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Akses seumur hidup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Sertifikat penyelesaian</span>
              </div>
            </div>

            {currentCourse.isEnrolled ? (
              <button
                className="btn btn-primary w-full"
                onClick={() => navigate(`/student/learn/${currentCourse.id}`)}
              >
                <BookOpen className="h-5 w-5" />
                Lanjutkan belajar
              </button>
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? <span className="loading loading-spinner"></span> : 'Daftar sekarang'}
              </button>
            )}

            {currentCourse.price > 0 && !currentCourse.isEnrolled && (
              <p className="text-xs text-center text-slate-500">Garansi uang kembali 30 hari</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage

