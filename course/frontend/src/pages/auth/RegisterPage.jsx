import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '../../store/slices/authSlice'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, user } = useSelector((state) => state.auth)
  const {
    register: registerForm,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  useEffect(() => {
    if (user) {
      navigate('/student/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = async (data) => {
    try {
      await dispatch(register(data)).unwrap()
      toast.success('Registrasi berhasil!')
      navigate('/student/dashboard')
    } catch (err) {
      // Error already handled in useEffect
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-4">Daftar</h2>
          <p className="text-center text-base-content/70 mb-6">
            Buat akun baru untuk memulai belajar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...registerForm('name', {
                  required: 'Nama wajib diisi',
                  minLength: {
                    value: 2,
                    message: 'Nama minimal 2 karakter',
                  },
                })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...registerForm('email', {
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...registerForm('password', {
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Password minimal 6 karakter',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
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
                {...registerForm('confirmPassword', {
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
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Daftar'
                )}
              </button>
            </div>
          </form>

          <div className="divider">ATAU</div>

          <p className="text-center text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="link link-primary">
              Login sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

