import { useEffect, useState } from 'react'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { Users, BookOpen, CreditCard, DollarSign } from 'lucide-react'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => {
        setDashboardData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Loading />
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>
  }

  const { stats, recentCourses, recentTransactions } = dashboardData

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-base-content/70">
          Overview platform dan statistik
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
              <BookOpen className="w-10 h-10 text-success" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <CreditCard className="w-10 h-10 text-warning" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title mb-4">Course Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Kategori</th>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail || '/placeholder-course.jpg'}
                          alt={course.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="font-medium">{course.title}</span>
                      </div>
                    </td>
                    <td>{course.category?.name}</td>
                    <td>{course._count?.enrollments || 0}</td>
                    <td>
                      <span
                        className={`badge ${
                          course.isPublished ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title mb-4">Transaksi Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.user?.name}</td>
                    <td>{transaction.course?.title || '-'}</td>
                    <td>{formatPrice(transaction.amount)}</td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.status === 'PAID'
                            ? 'badge-success'
                            : transaction.status === 'PENDING'
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

