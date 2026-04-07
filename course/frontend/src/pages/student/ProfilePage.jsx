import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { User, Lock } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: '',
      bio: '',
    },
  })

  const passwordForm = useForm()

  useEffect(() => {
    if (user) {
      api.get('/users/profile').then((res) => {
        const profileData = res.data.user
        profileForm.reset({
          name: profileData.name || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
        })
      })
    }
  }, [user, profileForm])

  const handleProfileUpdate = async (data) => {
    setLoading(true)
    try {
      await api.put('/users/profile', data)
      toast.success('Profile berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (data) => {
    setLoading(true)
    try {
      await api.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password berhasil diubah')
      passwordForm.reset()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
        <p className="text-base-content/70">
          Kelola informasi akun dan pengaturan keamanan
        </p>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'password' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <Lock className="w-4 h-4 mr-2" />
          Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Edit Profile</h2>
            <form
              onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...profileForm.register('name', { required: true })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={user?.email}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">
                    Email tidak dapat diubah
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">No. Telepon</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered"
                  {...profileForm.register('phone')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={4}
                  {...profileForm.register('bio')}
                ></textarea>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Ubah Password</h2>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password Saat Ini</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  {...passwordForm.register('currentPassword', {
                    required: true,
                  })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password Baru</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  {...passwordForm.register('newPassword', {
                    required: true,
                    minLength: 6,
                  })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Konfirmasi Password Baru</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  {...passwordForm.register('confirmPassword', {
                    required: true,
                    validate: (value) =>
                      value === passwordForm.watch('newPassword') ||
                      'Password tidak cocok',
                  })}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Ubah Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

