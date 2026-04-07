import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  useEffect(() => {
    if (!token) {
      toast.error('Token tidak valid')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      })
      setSuccess(true)
      toast.success('Password berhasil direset')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal reset password')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="card-title text-2xl justify-center mb-4">
              Password Berhasil Direset
            </h2>
            <p className="text-base-content/70 mb-6">
              Password Anda telah berhasil diubah. Silakan login dengan password
              baru.
            </p>
            <Link to="/login" className="btn btn-primary">
              Login Sekarang
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
            Reset Password
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Masukkan password baru Anda
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password Baru</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Password minimal 6 karakter',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      'Password harus mengandung huruf besar, huruf kecil, dan angka',
                  },
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword', {
                  required: 'Konfirmasi password wajib diisi',
                  validate: (value) =>
                    value === password || 'Password tidak cocok',
                })}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
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
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          <div className="divider">ATAU</div>

          <p className="text-center text-sm">
            <Link to="/login" className="link link-primary">
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

