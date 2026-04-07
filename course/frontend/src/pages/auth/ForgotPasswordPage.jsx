import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', data)
      setSubmitted(true)
      toast.success('Link reset password telah dikirim ke email Anda')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim email')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="card-title text-2xl justify-center mb-4">
              Email Terkirim
            </h2>
            <p className="text-base-content/70 mb-6">
              Kami telah mengirimkan link reset password ke email Anda. Silakan
              cek inbox atau spam folder.
            </p>
            <Link to="/login" className="btn btn-primary">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-4">
            Lupa Password
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Masukkan email Anda untuk menerima link reset password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid',
                  },
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>
            </div>
          </form>

          <div className="divider">ATAU</div>

          <p className="text-center text-sm">
            Ingat password?{' '}
            <Link to="/login" className="link link-primary">
              Login sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

