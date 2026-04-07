"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Clock, User, Shield } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  adminId: string
  admin: {
    id: string
    name: string
    email: string
  }
  details: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export default function AuditLogPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchLogs()
  }, [session, router, filterAction, filterEntity])

  const fetchLogs = async () => {
    try {
      const headers = getAuthHeaders()
      const params = new URLSearchParams()
      if (filterAction !== "all") params.append("action", filterAction)
      if (filterEntity !== "all") params.append("entityType", filterEntity)
      
      const response = await fetch(`/api/admin/audit-log?${params.toString()}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const actions = ["all", "create", "update", "delete", "approve", "reject", "verify", "activate", "deactivate", "moderate_approve", "moderate_reject"]
  const entities = ["all", "user", "course", "review", "payment", "category", "voucher", "report"]

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
              <h1 className="text-3xl font-bold mb-2">Audit Log</h1>
              <p className="text-muted-foreground">Track all administrative actions</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter by Action</label>
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action}
                        variant={filterAction === action ? "default" : "outline"}
                        onClick={() => setFilterAction(action)}
                        className="capitalize text-xs"
                        size="sm"
                      >
                        {action.replace("_", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter by Entity</label>
                  <div className="flex flex-wrap gap-2">
                    {entities.map((entity) => (
                      <Button
                        key={entity}
                        variant={filterEntity === entity ? "default" : "outline"}
                        onClick={() => setFilterEntity(entity)}
                        className="capitalize text-xs"
                        size="sm"
                      >
                        {entity}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Audit Logs Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-bold">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Admin</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Entity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Entity ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{new Date(log.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{log.admin.name}</p>
                            <p className="text-xs text-muted-foreground">{log.admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {log.action.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize">
                          {log.entityType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {log.entityId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {log.details && typeof log.details === "object" ? (
                          <details className="cursor-pointer">
                            <summary className="text-primary hover:underline">View Details</summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-w-xs">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No audit logs found</p>
              </div>
            )}
          </Card>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>
      </main>
    </div>
  )
}
