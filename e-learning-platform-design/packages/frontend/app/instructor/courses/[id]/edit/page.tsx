"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Trash2, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react"
import { getSession } from "@/lib/auth"
import { isYouTubeUrl } from "@/lib/youtube"
import { QuizManagement } from "@/components/quiz-management"
import type { Course, Section, Lesson } from "@/lib/types"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [session, setSession] = useState(getSession())
  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [sectionForm, setSectionForm] = useState({ title: "", description: "", isPreview: false })
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
    content: "",
    isPreview: false,
  })
  const [lessonVideoFileName, setLessonVideoFileName] = useState("")
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!session || (session.role !== "instructor" && session.role !== "admin")) {
      router.push("/login")
      return
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const courseData = await response.json()
          // Check ownership: by instructorId OR by instructor email (for mock auth compatibility)
          const isOwner = 
            courseData.instructorId === session.userId || 
            courseData.instructor?.email === session.email ||
            session.role === "admin"
          
          if (isOwner) {
            setCourse(courseData)
            setSections(courseData.sections || [])
            // Expand all sections by default
            if (courseData.sections) {
              setExpandedSections(new Set(courseData.sections.map((s: Section) => s.id)))
            }
          } else {
            console.warn('Access denied: Course ownership check failed', {
              courseInstructorId: courseData.instructorId,
              sessionUserId: session.userId,
              courseInstructorEmail: courseData.instructor?.email,
              sessionEmail: session.email
            })
            router.push("/instructor")
          }
        } else {
          console.error('Failed to fetch course:', response.status, response.statusText)
          router.push("/instructor")
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        router.push("/instructor")
      }
    }

    fetchCourse()
  }, [session, courseId, router])

  const fetchSections = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/sections`)
      if (response.ok) {
        const sectionsData = await response.json()
        setSections(sectionsData)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const handleSaveCourse = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: course?.title,
          description: course?.description,
          price: course?.price,
          category: course?.category,
          thumbnail: course?.thumbnail,
          videoUrl: course?.videoUrl || null,
          level: course?.level,
          isPublished: course?.isPublished,
        }),
      })

      if (response.ok) {
        toast.success("Course updated successfully!")
      } else {
        toast.error("Failed to update course")
      }
    } catch (error) {
      console.error('Error saving course:', error)
      toast.error("Error saving course")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSection = async () => {
    if (!sectionForm.title.trim()) return

    try {
      const response = await fetch(`/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm),
      })

      if (response.ok) {
        await fetchSections()
        setSectionForm({ title: "", description: "", isPreview: false })
        setShowAddSection(false)
      } else {
        toast.error("Failed to add section")
      }
    } catch (error) {
      console.error('Error adding section:', error)
      toast.error("Error adding section")
    }
  }

  const handleSaveSection = async () => {
    if (!editingSection || !sectionForm.title.trim()) return

    try {
      const response = await fetch(`/api/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm),
      })

      if (response.ok) {
        await fetchSections()
        setEditingSection(null)
        setSectionForm({ title: "", description: "", isPreview: false })
        setShowAddSection(false)
      } else {
        toast.error("Failed to update section")
      }
    } catch (error) {
      console.error('Error updating section:', error)
      toast.error("Error updating section")
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure? This will delete all lessons in this section.")) return

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSections()
      } else {
        toast.error("Failed to delete section")
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error("Error deleting section")
    }
  }

  const handleAddLesson = async () => {
    if (!selectedSectionId || !lessonForm.title.trim() || !lessonForm.videoUrl.trim() || !lessonForm.duration) return

    try {
      const response = await fetch(`/api/sections/${selectedSectionId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm),
      })

      if (response.ok) {
        await fetchSections()
        setLessonForm({ title: "", description: "", videoUrl: "", duration: "", content: "", isPreview: false })
        setLessonVideoFileName("")
        setShowAddLesson(false)
        setSelectedSectionId(null)
      } else {
        toast.error("Failed to add lesson")
      }
    } catch (error) {
      console.error('Error adding lesson:', error)
      toast.error("Error adding lesson")
    }
  }

  const handleEditLesson = async (lesson: Lesson) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          content: lesson.content,
          isPreview: lesson.isPreview,
        }),
      })

      if (response.ok) {
        await fetchSections()
        setEditingLesson(null)
        setLessonVideoFileName("")
      } else {
        toast.error("Failed to update lesson")
      }
    } catch (error) {
      console.error('Error updating lesson:', error)
      toast.error("Error updating lesson")
    }
  }

  // Validate video source: allow YouTube URL, any http(s) URL, or uploaded video (data URL)
  const isVideoSourceValid = (value: string) => {
    if (!value.trim()) return false
    const trimmed = value.trim()
    if (trimmed.startsWith("data:video")) return true
    if (/^https?:\/\//i.test(trimmed)) return true
    if (isYouTubeUrl(trimmed)) return true
    return false
  }

  const handleLessonVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file")
      return
    }

    // Basic size guard: 150MB
    const maxSize = 150 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Video too large. Please keep it under 150MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setLessonForm((prev) => ({ ...prev, videoUrl: base64 }))
      setLessonVideoFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
        })

      if (response.ok) {
        await fetchSections()
      } else {
        toast.error("Failed to delete lesson")
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
      toast.error("Failed to delete lesson")
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  if (!course) {
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
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/instructor" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="text-right">
              <p className="font-bold text-sm">{course.title}</p>
              <p className="text-xs text-muted-foreground">Edit Course</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Course Information */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Course Information</h2>
              <p className="text-sm text-muted-foreground">
                Manage your course metadata and publish status. Add sections and lessons below to build your course content.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course Title</label>
                <Input value={course.title} readOnly className="bg-muted" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea value={course.description} readOnly rows={4} className="bg-muted" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price</label>
                  <Input value={`$${course.price}`} readOnly className="bg-muted" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Input value={course.category} readOnly className="bg-muted" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Level</label>
                  <Input value={course.level || "Not set"} readOnly className="bg-muted" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">YouTube Preview Video URL</label>
                <Input
                  value={course.videoUrl || ""}
                  onChange={(e) => setCourse({ ...course, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Video preview untuk course
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={course.isPublished || false}
                  onCheckedChange={(checked) => setCourse({ ...course, isPublished: checked })}
                />
                <Label htmlFor="isPublished">Publish Course</Label>
              </div>
            </div>
          </Card>

          {/* Course Structure: Sections & Lessons */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Course Structure</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Organize your course content into sections and lessons
                </p>
              </div>
              <Dialog open={showAddSection} onOpenChange={(open) => {
                setShowAddSection(open)
                if (!open) {
                  setEditingSection(null)
                  setSectionForm({ title: "", description: "", isPreview: false })
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Section Title</Label>
                      <Input
                        value={sectionForm.title}
                        onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                        placeholder="e.g., Pengenalan, Pembelajaran Dasar"
                      />
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={sectionForm.description}
                        onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                        placeholder="Brief description of this section"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sectionPreview"
                        checked={sectionForm.isPreview}
                        onCheckedChange={(checked) => setSectionForm({ ...sectionForm, isPreview: checked })}
                      />
                      <Label htmlFor="sectionPreview">Free Preview (All lessons in this section will be free)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={editingSection ? handleSaveSection : handleAddSection}
                        disabled={!sectionForm.title.trim()}
                      >
                        {editingSection ? "Update Section" : "Add Section"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddSection(false)
                          setEditingSection(null)
                          setSectionForm({ title: "", description: "", isPreview: false })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No sections yet. Add your first section to start organizing your course content.</p>
                </div>
              ) : (
                sections.map((section) => (
                  <Card key={section.id} className="border-2">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {expandedSections.has(section.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{section.title}</h3>
                              {section.isPreview && (
                                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">FREE PREVIEW</span>
                              )}
                            </div>
                            {section.description && (
                              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {section.lessons?.length || 0} lessons
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSection(section)
                              setSectionForm({
                                title: section.title,
                                description: section.description || "",
                                isPreview: section.isPreview,
                              })
                              setShowAddSection(true)
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSectionId(section.id)
                              setShowAddLesson(true)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Lesson
                          </Button>
                        </div>
                      </div>

                      {expandedSections.has(section.id) && section.lessons && (
                        <div className="mt-4 space-y-2 pl-8">
                          {section.lessons.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">No lessons yet. Add your first lesson.</p>
                          ) : (
                            section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{lesson.title}</span>
                                    {lesson.isPreview && (
                                      <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">FREE</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{lesson.duration} minutes</p>
                  </div>
                  <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingLesson(lesson)
                                      setLessonForm({
                                        title: lesson.title,
                                        description: lesson.description,
                                        videoUrl: lesson.videoUrl,
                                        duration: lesson.duration.toString(),
                                        content: lesson.content || "",
                                        isPreview: lesson.isPreview,
                                      })
                                      setSelectedSectionId(section.id)
                                      setShowAddLesson(true)
                                    }}
                                  >
                                    <Edit2 className="w-4 h-4" />
                    </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                  >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          {/* Add/Edit Lesson Dialog */}
          <Dialog open={showAddLesson} onOpenChange={setShowAddLesson}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Lesson Title *</Label>
                  <Input
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="Enter lesson title"
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    placeholder="Enter lesson description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>Video Source (YouTube URL or Upload) *</Label>
                    <Input
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value, })}
                      placeholder="https://www.youtube.com/watch?v=... or https://cdn.com/video.mp4"
                      className={lessonForm.videoUrl && !isVideoSourceValid(lessonForm.videoUrl) ? "border-destructive" : ""}
                    />
                    {lessonForm.videoUrl && !isVideoSourceValid(lessonForm.videoUrl) && (
                      <p className="text-xs text-destructive mt-1">Enter a valid YouTube/HTTP URL or upload a video file below.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload Video (mp4, &lt; 150MB)</Label>
                    <Input type="file" accept="video/*" onChange={handleLessonVideoUpload} className="cursor-pointer" />
                    {lessonVideoFileName && (
                      <p className="text-xs text-muted-foreground">Selected: {lessonVideoFileName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">You can either paste a video URL above or upload a video file.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration (minutes) *</Label>
                    <Input
                      type="number"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2 w-full">
                      <Switch
                        id="lessonPreview"
                        checked={lessonForm.isPreview}
                        onCheckedChange={(checked) => setLessonForm({ ...lessonForm, isPreview: checked })}
                      />
                      <Label htmlFor="lessonPreview">Free Preview</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Content/Text Material (Optional)</Label>
                  <Textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    placeholder="Additional text content, notes, or materials"
                    rows={5}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (editingLesson) {
                        handleEditLesson({ ...editingLesson, ...lessonForm })
                      } else {
                        handleAddLesson()
                      }
                    }}
                    disabled={
                      !lessonForm.title.trim() ||
                      !lessonForm.description.trim() ||
                      !lessonForm.videoUrl.trim() ||
                      !lessonForm.duration ||
                      !isVideoSourceValid(lessonForm.videoUrl)
                    }
                  >
                    {editingLesson ? "Update Lesson" : "Add Lesson"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddLesson(false)
                      setEditingLesson(null)
                      setLessonForm({ title: "", description: "", videoUrl: "", duration: "", content: "", isPreview: false })
                      setLessonVideoFileName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quiz Management */}
          <QuizManagement courseId={courseId} />

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleSaveCourse} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Link href="/instructor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
