"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Clock
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

interface Report {
  id: string
  type: string
  targetId: string
  reason: string
  description: string | null
  status: string
  reviewedBy: string | null
  reviewedAt: string | null
  resolution: string | null
  reportedBy: {
    id: string
    name: string
    email: string
  }
  course: {
    id: string
    title: string
  } | null
  createdAt: string
}

export default function ComplaintsPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: "resolve" | "dismiss" | null }>({
    open: false,
    action: null,
  })
  const [resolution, setResolution] = useState("")

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchReports()
  }, [session, router, filterStatus])

  const fetchReports = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/reports?status=${filterStatus}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: "resolve" | "dismiss") => {
    if (!selectedReport) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/reports/${selectedReport.id}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resolution: action === "resolve" ? resolution : null,
        }),
      })

      if (response.ok) {
        fetchReports()
        setActionDialog({ open: false, action: null })
        setSelectedReport(null)
        setResolution("")
      }
    } catch (error) {
      console.error("Error handling report:", error)
    }
  }

  const filteredReports = reports.filter((report) =>
    report.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.course?.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Reports & Complaints</h1>
            <p className="text-muted-foreground">Handle user reports and complaints</p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {["pending", "reviewed", "resolved", "dismissed", "all"].map((status) => (
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

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <h4 className="font-bold">Report: {report.type}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === "resolved" ? "bg-green-500/10 text-green-600" :
                        report.status === "dismissed" ? "bg-gray-500/10 text-gray-600" :
                        report.status === "reviewed" ? "bg-blue-500/10 text-blue-600" :
                        "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Reported by: <span className="font-medium">{report.reportedBy.name}</span>
                    </p>
                    {report.course && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Course: <span className="font-medium">{report.course.title}</span>
                      </p>
                    )}
                    <p className="text-sm font-medium mb-1">Reason: {report.reason}</p>
                    {report.description && (
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    )}
                    {report.resolution && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Resolution:</p>
                        <p className="text-sm">{report.resolution}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      {report.reviewedAt && (
                        <>
                          <span>•</span>
                          <span>Reviewed {new Date(report.reviewedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {report.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setActionDialog({ open: true, action: "resolve" })
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedReport(report)
                        setActionDialog({ open: true, action: "dismiss" })
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "resolve" ? "Resolve Report" : "Dismiss Report"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "resolve"
                ? `Resolve this report and provide a resolution note.`
                : `Are you sure you want to dismiss this report?`}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.action === "resolve" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter resolution details..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setActionDialog({ open: false, action: null })
              setResolution("")
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => handleAction(actionDialog.action!)}
              variant={actionDialog.action === "dismiss" ? "outline" : "default"}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

