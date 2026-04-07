import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

const QuizPage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/quizzes/${quizId}`)
      .then((res) => {
        setQuiz(res.data.quiz)
        if (res.data.quiz.duration > 0) {
          setTimeLeft(res.data.quiz.duration * 60) // Convert to seconds
        }
      })
      .catch((err) => {
        toast.error('Gagal memuat quiz')
        navigate(-1)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [quizId, navigate])

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, submitted])

  const handleSubmit = async () => {
    if (submitted) return

    setSubmitted(true)
    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers })
      toast.success(
        res.data.attempt.passed
          ? 'Selamat! Anda lulus quiz'
          : 'Anda belum lulus. Silakan coba lagi'
      )
    } catch (error) {
      toast.error('Gagal submit quiz')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <Loading />
  }

  if (!quiz) {
    return <div>Quiz tidak ditemukan</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          {quiz.description && (
            <p className="text-base-content/70">{quiz.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex items-start gap-3 mb-4">
                <span className="badge badge-primary badge-lg">
                  {index + 1}
                </span>
                <p className="text-lg font-medium flex-1">{question.question}</p>
                <span className="badge badge-ghost">{question.points} poin</span>
              </div>

              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[question.id] === key
                          ? 'border-primary bg-primary/10'
                          : 'border-base-300 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={key}
                        checked={answers[question.id] === key}
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.id]: e.target.value })
                        }
                        disabled={submitted}
                        className="radio radio-primary"
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="space-y-2">
                  {['True', 'False'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'border-primary bg-primary/10'
                          : 'border-base-300 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          setAnswers({ ...answers, [question.id]: e.target.value })
                        }
                        disabled={submitted}
                        className="radio radio-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizPage

