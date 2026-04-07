"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Ticket, Calendar } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

interface Voucher {
  id: string
  code: string
  description: string | null
  discountType: string
  discountValue: number
  minPurchase: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export default function VouchersPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [voucherDialog, setVoucherDialog] = useState<{ open: boolean; voucher: Voucher | null }>({
    open: false,
    voucher: null,
  })
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchase: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
  })

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchVouchers()
  }, [session, router])

  const fetchVouchers = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/admin/vouchers', { headers })
      if (response.ok) {
        const data = await response.json()
        setVouchers(data)
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const headers = getAuthHeaders()
      const url = voucherDialog.voucher
        ? `/api/admin/vouchers/${voucherDialog.voucher.id}`
        : '/api/admin/vouchers'
      const method = voucherDialog.voucher ? 'PATCH' : 'POST'

      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue.toString()),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      }

      const response = await fetch(url, {
        method,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        fetchVouchers()
        setVoucherDialog({ open: false, voucher: null })
        setFormData({
          code: "",
          description: "",
          discountType: "percentage",
          discountValue: 0,
          minPurchase: "",
          maxDiscount: "",
          usageLimit: "",
          validFrom: "",
          validUntil: "",
        })
      }
    } catch (error) {
      console.error("Error saving voucher:", error)
    }
  }

  const handleToggleActive = async (voucherId: string, isActive: boolean) => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/vouchers/${voucherId}`, {
        method: 'PATCH',
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchVouchers()
      }
    } catch (error) {
      console.error("Error toggling voucher:", error)
    }
  }

  const handleDelete = async (voucherId: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/vouchers/${voucherId}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        fetchVouchers()
      }
    } catch (error) {
      console.error("Error deleting voucher:", error)
    }
  }

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Voucher Management</h1>
              <p className="text-muted-foreground">Manage discount vouchers and promo codes</p>
            </div>
            <Button
              onClick={() => {
                setVoucherDialog({ open: true, voucher: null })
                setFormData({
                  code: "",
                  description: "",
                  discountType: "percentage",
                  discountValue: 0,
                  minPurchase: "",
                  maxDiscount: "",
                  usageLimit: "",
                  validFrom: "",
                  validUntil: "",
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Voucher
            </Button>
          </div>

          {/* Search */}
          <Card className="p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Vouchers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVouchers.map((voucher) => {
              const isExpired = new Date(voucher.validUntil) < new Date()
              const isUsedUp = voucher.usageLimit && voucher.usedCount >= voucher.usageLimit

              return (
                <Card key={voucher.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-bold font-mono">{voucher.code}</h3>
                        <p className="text-xs text-muted-foreground">
                          {voucher.discountType === "percentage"
                            ? `${voucher.discountValue}% off`
                            : `$${voucher.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      !voucher.isActive || isExpired || isUsedUp
                        ? "bg-gray-500/10 text-gray-600"
                        : "bg-green-500/10 text-green-600"
                    }`}>
                      {!voucher.isActive ? "Inactive" : isExpired ? "Expired" : isUsedUp ? "Used Up" : "Active"}
                    </span>
                  </div>
                  {voucher.description && (
                    <p className="text-sm text-muted-foreground mb-4">{voucher.description}</p>
                  )}
                  <div className="space-y-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(voucher.validFrom).toLocaleDateString()} - {new Date(voucher.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                    {voucher.usageLimit && (
                      <div>
                        Used: {voucher.usedCount} / {voucher.usageLimit}
                      </div>
                    )}
                    {voucher.minPurchase && (
                      <div>Min purchase: ${voucher.minPurchase}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setVoucherDialog({ open: true, voucher })
                        setFormData({
                          code: voucher.code,
                          description: voucher.description || "",
                          discountType: voucher.discountType,
                          discountValue: voucher.discountValue,
                          minPurchase: voucher.minPurchase?.toString() || "",
                          maxDiscount: voucher.maxDiscount?.toString() || "",
                          usageLimit: voucher.usageLimit?.toString() || "",
                          validFrom: new Date(voucher.validFrom).toISOString().split('T')[0],
                          validUntil: new Date(voucher.validUntil).toISOString().split('T')[0],
                        })
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(voucher.id, voucher.isActive)}
                      className="flex-1"
                    >
                      {voucher.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(voucher.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredVouchers.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No vouchers found</p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Voucher Dialog */}
      <Dialog open={voucherDialog.open} onOpenChange={(open) => setVoucherDialog({ open, voucher: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {voucherDialog.voucher ? "Edit Voucher" : "Add Voucher"}
            </DialogTitle>
            <DialogDescription>
              {voucherDialog.voucher
                ? "Update voucher information"
                : "Create a new discount voucher"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Voucher Code *</Label>
                  <Input
                    id="code"
                    placeholder="SUMMER2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={formData.discountType === "percentage" ? "10" : "50"}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  required
                />
                {formData.discountType === "percentage" && (
                  <p className="text-xs text-muted-foreground mt-1">Enter percentage (e.g., 10 for 10%)</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Voucher description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPurchase">Minimum Purchase ($)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  />
                </div>
                {formData.discountType === "percentage" && (
                  <div>
                    <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until *</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVoucherDialog({ open: false, voucher: null })}
              >
                Cancel
              </Button>
              <Button type="submit">
                {voucherDialog.voucher ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
