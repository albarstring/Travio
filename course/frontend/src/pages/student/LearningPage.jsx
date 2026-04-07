import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import ReactPlayer from 'react-player'
import { CheckCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const LearningPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [enrollment, setEnrollment] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/enrollments/${courseId}`)
      .then((res) => {
        setEnrollment(res.data.enrollment)
        const lessons = res.data.enrollment.course.lessons
        const lesson = lessonId
          ? lessons.find((l) => l.id === lessonId)
          : lessons[0]
        if (lesson) {
          setCurrentLesson(lesson)
          if (!lessonId && lessons.length > 0) {
            navigate(`/student/learn/${courseId}/lesson/${lessons[0].id}`, {
              replace: true,
            })
          }
        }
      })
      .catch((err) => {
        toast.error('Gagal memuat course')
        navigate('/student/courses')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [courseId, lessonId, navigate])

  const handleLessonComplete = async () => {
    try {
      await api.post('/progress', {
        lessonId: currentLesson.id,
        courseId,
        status: 'COMPLETED',
      })
      toast.success('Lesson selesai!')
      // Refresh enrollment
      const res = await api.get(`/enrollments/${courseId}`)
      setEnrollment(res.data.enrollment)
    } catch (error) {
      toast.error('Gagal menyimpan progress')
    }
  }

  const getNextLesson = () => {
    const lessons = enrollment?.course?.lessons || []
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id)
    if (currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1]
    }
    return null
  }

  const getPrevLesson = () => {
    const lessons = enrollment?.course?.lessons || []
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id)
    if (currentIndex > 0) {
      return lessons[currentIndex - 1]
    }
    return null
  }

  if (loading) {
    return <Loading />
  }

  if (!enrollment || !currentLesson) {
    return <div>Course tidak ditemukan</div>
  }

  const nextLesson = getNextLesson()
  const prevLesson = getPrevLesson()
  const progressList = enrollment.lessonProgress || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-3 space-y-4">
        <div className="card bg-base-100 shadow-md">
          <div className="aspect-video bg-black">
            {currentLesson.videoUrl ? (
              <ReactPlayer
                url={currentLesson.videoUrl}
                width="100%"
                height="100%"
                controls
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Video tidak tersedia
              </div>
            )}
          </div>
          <div className="card-body">
            <h1 className="card-title text-2xl">{currentLesson.title}</h1>
            <p className="text-base-content/70">{currentLesson.description}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={handleLessonComplete}
              >
                <CheckCircle className="w-5 h-5" />
                Tandai Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            className="btn btn-outline"
            disabled={!prevLesson}
            onClick={() =>
              navigate(
                `/student/learn/${courseId}/lesson/${prevLesson?.id}`
              )
            }
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            className="btn btn-primary"
            disabled={!nextLesson}
            onClick={() =>
              navigate(
                `/student/learn/${courseId}/lesson/${nextLesson?.id}`
              )
            }
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="card bg-base-100 shadow-md sticky top-4">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <BookOpen className="w-5 h-5" />
              Kurikulum
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {enrollment.course.lessons.map((lesson, index) => {
                const progress = progressList.find((p) => p.lessonId === lesson.id)
                const isCompleted = progress?.status === 'COMPLETED'
                const isActive = lesson.id === currentLesson.id

                return (
                  <button
                    key={lesson.id}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-content'
                        : isCompleted
                        ? 'bg-success/10 text-success'
                        : 'bg-base-200 hover:bg-base-300'
                    }`}
                    onClick={() =>
                      navigate(`/student/learn/${courseId}/lesson/${lesson.id}`)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className="text-xs opacity-70">
                          {Math.floor(lesson.duration / 60)} menit
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningPage

