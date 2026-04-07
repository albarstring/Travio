"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  DollarSign,
  Filter
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Payment {
  id: string
  amount: number
  originalAmount: number | null
  discount: number
  voucherCode: string | null
  status: string
  paymentMethod: string | null
  transactionId: string | null
  user: {
    id: string
    name: string
    email: string
  }
  course: {
    id: string
    title: string
  }
  validatedBy: string | null
  validatedAt: string | null
  createdAt: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchPayments()
  }, [session, router, filterStatus])

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/admin/payments?status=${filterStatus}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/validate`, {
        method: "POST",
      })

      if (response.ok) {
        fetchPayments()
      }
    } catch (error) {
      console.error("Error validating payment:", error)
    }
  }

  const filteredPayments = payments.filter((payment) =>
    payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = payments.filter((p) => p.status === "pending").length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
            <p className="text-muted-foreground">Manage transactions and validate payments</p>
          </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Pending Payments</p>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <Filter className="w-6 h-6 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by user, course, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {["all", "pending", "completed", "failed", "refunded"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Payments Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-bold">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">
                      {payment.transactionId || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-sm">{payment.user.name}</p>
                        <p className="text-xs text-muted-foreground">{payment.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{payment.course.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">${payment.amount.toFixed(2)}</p>
                        {payment.discount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${payment.originalAmount?.toFixed(2)}
                          </p>
                        )}
                        {payment.voucherCode && (
                          <p className="text-xs text-green-600">Voucher: {payment.voucherCode}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        payment.status === "completed" ? "bg-green-500/10 text-green-600" :
                        payment.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                        payment.status === "failed" ? "bg-red-500/10 text-red-600" :
                        "bg-gray-500/10 text-gray-600"
                      }`}>
                        {payment.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                        {payment.status === "pending" && <Clock className="w-3 h-3" />}
                        {payment.status === "failed" && <XCircle className="w-3 h-3" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleValidate(payment.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Validate
                        </Button>
                      )}
                      {payment.status === "completed" && payment.validatedAt && (
                        <p className="text-xs text-muted-foreground">
                          Validated {new Date(payment.validatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          )}
        </Card>
        </div>
      </main>
    </div>
  )
}

