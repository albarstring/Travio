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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Tag } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [formData, setFormData] = useState({ name: "", description: "" })

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchCategories()
  }, [session, router])

  const fetchCategories = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/admin/categories', { headers })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const headers = getAuthHeaders()
      const url = categoryDialog.category
        ? `/api/admin/categories/${categoryDialog.category.id}`
        : '/api/admin/categories'
      const method = categoryDialog.category ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCategories()
        setCategoryDialog({ open: false, category: null })
        setFormData({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleToggleActive = async (categoryId: string, isActive: boolean) => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error("Error toggling category:", error)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-3xl font-bold mb-2">Category Management</h1>
              <p className="text-muted-foreground">Manage course categories</p>
            </div>
            <Button
              onClick={() => {
                setCategoryDialog({ open: true, category: null })
                setFormData({ name: "", description: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Search */}
          <Card className="p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">{category.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    category.isActive
                      ? "bg-green-500/10 text-green-600"
                      : "bg-gray-500/10 text-gray-600"
                  }`}>
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCategoryDialog({ open: true, category })
                      setFormData({ name: category.name, description: category.description || "" })
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(category.id, category.isActive)}
                    className="flex-1"
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No categories found</p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Category Dialog */}
      <Dialog open={categoryDialog.open} onOpenChange={(open) => setCategoryDialog({ open, category: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryDialog.category ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {categoryDialog.category
                ? "Update category information"
                : "Create a new course category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category Name</label>
                <Input
                  placeholder="e.g., Web Development"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Category description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryDialog({ open: false, category: null })}
              >
                Cancel
              </Button>
              <Button type="submit">
                {categoryDialog.category ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
