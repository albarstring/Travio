"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Trash2, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  UserX,
  AlertTriangle,
  Eye,
  MoreVertical,
  UserPlus
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { getAuthHeaders } from "@/lib/api-helpers"

interface ExtendedUser extends User {
  isVerified?: boolean
  isActive?: boolean
  isApproved?: boolean
  violationCount?: number
}

export function UsersList() {
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all") // all, active, inactive
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: "verify" | "activate" | "deactivate" | "violation" | "delete" | null
  }>({ open: false, type: null })
  const [viewDialog, setViewDialog] = useState(false)
  const [violationReason, setViolationReason] = useState("")
  const [createInstructorDialog, setCreateInstructorDialog] = useState(false)
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [createLoading, setCreateLoading] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log('[USERS LIST] Fetching users with auth headers')
        const headers = getAuthHeaders()
        console.log('[USERS LIST] Headers:', headers)
        
        const response = await fetch('/api/admin/users', {
          headers
        })
        
        console.log('[USERS LIST] Response status:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('[USERS LIST] Users loaded successfully:', data.length)
          setUsers(data)
        } else {
          const errorData = await response.json()
          console.error('[USERS LIST] API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
        }
      } catch (error) {
        console.error('[USERS LIST] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleCreateInstructor = async () => {
    if (!newInstructor.name || !newInstructor.email || !newInstructor.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (newInstructor.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setCreateLoading(true)
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/admin/users/create-instructor', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor)
      })

      if (response.ok) {
        toast.success('Instructor account created successfully!')
        setCreateInstructorDialog(false)
        setNewInstructor({ name: '', email: '', password: '' })
        
        // Refresh users list
        const updatedResponse = await fetch('/api/admin/users', { headers: getAuthHeaders() })
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setUsers(updatedData)
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create instructor')
      }
    } catch (error) {
      console.error('Error creating instructor:', error)
      toast.error('An error occurred while creating instructor')
    } finally {
      setCreateLoading(false)
    }
  }


  const handleAction = async (userId: string, action: string, data?: any) => {
    try {
      const headers = getAuthHeaders()
      const method = action === "delete" ? "DELETE" : "PATCH"
      
      console.log(`[USER ACTION] Performing ${action} on user ${userId}`)
      console.log(`[USER ACTION] Headers:`, headers)
      
      const fetchOptions: RequestInit = {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
      }

      // Only add body for non-DELETE requests
      if (method !== "DELETE") {
        fetchOptions.body = JSON.stringify({ action, ...data })
      }

      const response = await fetch(`/api/admin/users/${userId}`, fetchOptions)

      console.log(`[USER ACTION] Response status:`, response.status)

      if (response.ok) {
        console.log(`[USER ACTION] ${action} successful`)
        // Refresh users list
        const updatedResponse = await fetch('/api/admin/users', { headers: getAuthHeaders() })
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setUsers(updatedData)
          console.log(`[USER ACTION] Users list refreshed`)
        }
        setActionDialog({ open: false, type: null })
        setSelectedUser(null)
        setViolationReason("")
      } else {
        const errorData = await response.json()
        console.error(`[USER ACTION] Error ${response.status}:`, errorData)
        toast.error(errorData.error || 'Failed to perform action')
      }
    } catch (error) {
      console.error('[USER ACTION] Fetch error:', error)
      toast.error('An error occurred while performing the action')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <Button onClick={() => setCreateInstructorDialog(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Create Instructor
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Filter by Role</label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12 px-6">
            <p className="text-muted-foreground mb-2">No users found in database</p>
            <p className="text-xs text-muted-foreground">Users will appear here once they register on the platform</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/5
                ">
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={user.name}
                            className="w-full h-full object-cover object-center scale-110"
                      />
                        </div>
                        <div>
                      <span className="font-medium">{user.name}</span>
                          {user.violationCount && user.violationCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-destructive">
                              <AlertTriangle className="w-3 h-3" />
                              {user.violationCount} violation{user.violationCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                      {user.role === "admin" && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          user.isVerified 
                            ? "bg-green-500/10 text-green-600" 
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}>
                          {user.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Unverified
                            </>
                          )}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive 
                            ? "bg-blue-500/10 text-blue-600" 
                            : "bg-red-500/10 text-red-600"
                        }`}>
                          {user.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                        {user.role === "instructor" && user.isApproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                      </div>
                    </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                      </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setViewDialog(true)
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {!user.isVerified && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user)
                                setActionDialog({ open: true, type: "verify" })
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Verify {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </DropdownMenuItem>
                          )}
                          {user.isActive ? (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user)
                                setActionDialog({ open: true, type: "deactivate" })
                              }}
                              className="text-destructive"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Deactivate Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user)
                                setActionDialog({ open: true, type: "activate" })
                              }}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user)
                              setActionDialog({ open: true, type: "violation" })
                            }}
                            className="text-destructive"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Record Violation
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user)
                              setActionDialog({ open: true, type: "delete" })
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 px-6">
                <p className="text-muted-foreground">No results match your filters</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "verify" && `Verify ${selectedUser?.role.charAt(0).toUpperCase()}${selectedUser?.role.slice(1)}`}
              {actionDialog.type === "activate" && "Activate Account"}
              {actionDialog.type === "deactivate" && "Deactivate Account"}
              {actionDialog.type === "violation" && "Record Violation"}
              {actionDialog.type === "delete" && "Delete User"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "verify" && `Are you sure you want to verify ${selectedUser?.name} as a ${selectedUser?.role}?`}
              {actionDialog.type === "activate" && `Are you sure you want to activate ${selectedUser?.name}'s account?`}
              {actionDialog.type === "deactivate" && `Are you sure you want to deactivate ${selectedUser?.name}'s account?`}
              {actionDialog.type === "violation" && `Record a violation for ${selectedUser?.name}. This will increase their violation count.`}
              {actionDialog.type === "delete" && `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone and will permanently remove all user data.`}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.type === "violation" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter violation reason..."
                value={violationReason}
                onChange={(e) => setViolationReason(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, type: null })
                setSelectedUser(null)
                setViolationReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedUser) {
                  handleAction(
                    selectedUser.id,
                    actionDialog.type || "",
                    actionDialog.type === "violation" ? { reason: violationReason } : {}
                  )
                }
              }}
              variant={actionDialog.type === "deactivate" || actionDialog.type === "violation" || actionDialog.type === "delete" ? "destructive" : "default"}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover object-center scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">{selectedUser.role}</Badge>
                    {selectedUser.role === "instructor" && selectedUser.isVerified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                    {selectedUser.role === "instructor" && selectedUser.isApproved && (
                      <Badge variant="default">Approved</Badge>
                    )}
                    <Badge variant={selectedUser.isActive ? "default" : "destructive"}>
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-mono">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedUser.bio && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Bio</label>
                    <p className="text-sm">{selectedUser.bio}</p>
                  </div>
                )}
                {selectedUser.violationCount && selectedUser.violationCount > 0 && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Violations</label>
                    <p className="text-sm text-destructive font-bold">
                      {selectedUser.violationCount} violation{selectedUser.violationCount > 1 ? 's' : ''}
                    </p>
                    {selectedUser.lastViolationAt && (
                      <p className="text-xs text-muted-foreground">
                        Last violation: {new Date(selectedUser.lastViolationAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Instructor Dialog */}
      <Dialog open={createInstructorDialog} onOpenChange={setCreateInstructorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Instructor Account</DialogTitle>
            <DialogDescription>
              Create a new instructor account. The instructor will be able to create and manage courses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="John Doe"
                value={newInstructor.name}
                onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="instructor@example.com"
                value={newInstructor.email}
                onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Min. 6 characters"
                value={newInstructor.password}
                onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateInstructorDialog(false)
                setNewInstructor({ name: '', email: '', password: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInstructor} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Instructor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
