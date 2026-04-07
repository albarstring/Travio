import { useEffect, useState } from 'react'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react'

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/transactions')
      .then((res) => {
        setTransactions(res.data.transactions)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-error" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-warning" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      PAID: 'badge-success',
      PENDING: 'badge-warning',
      FAILED: 'badge-error',
      CANCELLED: 'badge-ghost',
    }
    return statusMap[status] || 'badge-ghost'
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-base-content/70">
          Riwayat transaksi pembelian course
        </p>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.course ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={transaction.course.thumbnail || '/placeholder-course.jpg'}
                              alt={transaction.course.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <span className="font-medium">
                              {transaction.course.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base-content/60">-</span>
                        )}
                      </td>
                      <td className="font-semibold">
                        {formatPrice(transaction.amount)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span
                            className={`badge ${getStatusBadge(transaction.status)}`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td>
                        {transaction.status === 'PENDING' && (
                          <button className="btn btn-sm btn-primary">
                            Upload Bukti
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-xl text-base-content/70">
                Belum ada transaksi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistoryPage

