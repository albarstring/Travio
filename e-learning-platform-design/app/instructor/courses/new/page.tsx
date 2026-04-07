"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { getSession } from "@/lib/auth"

export default function CreateCoursePage() {
  const router = useRouter()
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    level: "Beginner",
    price: "",
    thumbnail: null as string | null,
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

  useEffect(() => {
    // Ensure component is mounted on client before checking session
    setIsMounted(true)
    const currentSession = getSession()
    setSession(currentSession)

    if (!currentSession || (currentSession.role !== "instructor" && currentSession.role !== "admin")) {
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression, try progressively lower quality if too large
          let base64 = canvas.toDataURL('image/jpeg', quality)
          let currentQuality = quality
          
          // Keep reducing quality until size is acceptable (max 1.2MB base64)
          while (base64.length > 1200000 && currentQuality > 0.3) {
            currentQuality -= 0.1
            base64 = canvas.toDataURL('image/jpeg', currentQuality)
          }
          
          // If still too large, reduce dimensions further
          if (base64.length > 1200000) {
            const smallerWidth = Math.floor(width * 0.8)
            const smallerHeight = Math.floor(height * 0.8)
            canvas.width = smallerWidth
            canvas.height = smallerHeight
            ctx.drawImage(img, 0, 0, smallerWidth, smallerHeight)
            base64 = canvas.toDataURL('image/jpeg', 0.7)
          }
          
          console.log('Final compressed size:', base64.length, 'characters, Quality:', currentQuality)
          resolve(base64)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setThumbnailFile(file)
      
      try {
        // Compress and convert to base64
        const base64 = await compressImage(file)
        console.log('Image compressed - Original size:', file.size, 'bytes, Base64 length:', base64.length)
        
        setThumbnailPreview(base64)
        setFormData((prev) => ({ ...prev, thumbnail: base64 }))
      } catch (error) {
        console.error('Error processing image:', error)
        alert('Failed to process image. Please try another image.')
        setThumbnailFile(null)
      }
    }
  }

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim()
    
    // Validate: reject file:// paths
    if (url.startsWith('file://')) {
      alert('File paths are not allowed. Please use a web URL (http:// or https://) or upload an image file.')
      e.target.value = ''
      return
    }
    
    // Validate: must be http/https URL or empty
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      alert('Please enter a valid web URL (http:// or https://) or upload an image file.')
      e.target.value = ''
      return
    }
    
    if (url) {
      setThumbnailPreview(url)
      setFormData((prev) => ({ ...prev, thumbnail: url }))
      setThumbnailFile(null)
    } else {
      setThumbnailPreview('')
      setFormData((prev) => ({ ...prev, thumbnail: null }))
      setThumbnailFile(null)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!session) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          level: formData.level,
          price: formData.price,
          thumbnail: formData.thumbnail || null, // Send thumbnail data
          instructorId: session.userId,
          email: session.email, // Include email to help find instructor if ID doesn't match
        }),
      })

      if (response.ok) {
        const course = await response.json()
        console.log('✅ Course created successfully:', course)
        console.log('✅ Course ID:', course.id)
        
        if (course && course.id) {
          console.log('🔄 Redirecting to:', `/instructor/courses/${course.id}/edit`)
          router.push(`/instructor/courses/${course.id}/edit`)
        } else {
          console.error('❌ Course ID not found in response:', course)
          alert('Course created but ID not found. Redirecting to dashboard.')
          router.push("/instructor")
        }
      } else {
        let errorMessage = "Failed to create course. Please try again."
        
        // Clone response to read it multiple times if needed
        const responseClone = response.clone()
        
        try {
          const errorData = await response.json()
          console.error("=== Error Response ===")
          console.error("Status:", response.status)
          console.error("StatusText:", response.statusText)
          console.error("Error data:", errorData)
          console.error("Error data type:", typeof errorData)
          console.error("Error data keys:", Object.keys(errorData || {}))
          
          // Extract error message from various possible formats
          if (errorData?.error) {
            errorMessage = String(errorData.error)
          } else if (errorData?.message) {
            errorMessage = String(errorData.message)
          } else if (errorData?.details?.message) {
            errorMessage = String(errorData.details.message)
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          }
          
          // Log details if available
          if (errorData?.details) {
            console.error("Error details object:", errorData.details)
            console.error("Error details stringified:", JSON.stringify(errorData.details, null, 2))
            // If details has a message, prefer it
            if (errorData.details.message) {
              errorMessage = String(errorData.details.message)
            }
          }
          console.error("Final error message:", errorMessage)
          console.error("=====================")
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError)
          try {
            const text = await responseClone.text()
            console.error("Response as text:", text)
            if (text) {
              errorMessage = `Server error: ${text.substring(0, 200)}`
            } else {
              errorMessage = `Server error (status ${response.status}): ${response.statusText}`
            }
          } catch (textError) {
            console.error("Could not read response text:", textError)
            errorMessage = `Server error (status ${response.status}): ${response.statusText}`
          }
        }
        alert(errorMessage)
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("Network error creating course:", error)
      console.error("Error type:", typeof error)
      console.error("Error keys:", Object.keys(error || {}))
      alert(`Failed to create course: ${error?.message || error?.toString() || "Network error. Please check your connection."}`)
      setIsLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.role !== "instructor" && session.role !== "admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/instructor" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-muted-foreground">
              Fill in the course metadata below. After creating, you'll be redirected to manage sections and lessons.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Course Title</label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., Advanced React Patterns"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                name="description"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Course Thumbnail</label>
              
              {/* Upload File Option */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload an image file (max 5MB, will be automatically compressed)
                </p>
              </div>

              {/* Or URL Option */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Or Enter Image URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={thumbnailPreview && !thumbnailFile ? thumbnailPreview : ""}
                  onChange={handleThumbnailUrlChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste an image URL from the web
                </p>
              </div>

              {/* Preview */}
              {thumbnailPreview && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div className="w-full max-w-xs aspect-video border border-border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Preview image failed to load')
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Data Science</option>
                  <option>Design</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price ($)</label>
                <Input
                  type="number"
                  name="price"
                  placeholder="49.99"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Course"}
              </Button>
              <Link href="/instructor">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
