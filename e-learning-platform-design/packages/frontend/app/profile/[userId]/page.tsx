"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Star, 
  Edit, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Download,
  Twitter,
  Linkedin,
  Github,
  Settings,
  Bell,
  Lock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getSession } from "@/lib/auth"
import { getAuthHeaders } from "@/lib/api-helpers"
import { downloadCertificateAsPDF } from "@/lib/certificate-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProfileData {
  id: string
  name: string
  email: string
  avatar: string | null
  bio: string | null
  role: string
  skills: string[]
  phone: string | null
  location: string | null
  website: string | null
  socialLinks: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  enrollments?: any[]
  taughtCourses?: any[]
  reviews?: any[]
  certificates?: any[]
  instructorStats?: {
    totalEarnings: number
    totalStudents: number
    totalCourses: number
    avgRating: number
  }
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const session = getSession()
  const isOwnProfile = session?.userId === userId

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null)

  useEffect(() => {
    // Redirect admin away from profile page
    if (session?.role === "admin") {
      router.push("/admin")
      return
    }
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const endpoint = isOwnProfile ? "/api/profile" : `/api/profile/${userId}`
      const headers = isOwnProfile ? getAuthHeaders() : {}
      const response = await fetch(endpoint, {
        headers
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditData({
          name: data.name || "",
          bio: data.bio || "",
          phone: data.phone || "",
          location: data.location || "",
          website: data.website || "",
          skills: data.skills?.join(", ") || "",
          socialLinks: {
            twitter: data.socialLinks?.twitter || "",
            linkedin: data.socialLinks?.linkedin || "",
            github: data.socialLinks?.github || ""
          }
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCertificate = async (certificateId: string, courseName: string) => {
    try {
      setDownloadingCertId(certificateId)
      await downloadCertificateAsPDF(
        certificateId,
        profile?.name || 'User',
        courseName
      )
    } catch (error) {
      console.error('Failed to download certificate:', error)
    } finally {
      setDownloadingCertId(null)
    }
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height
          const maxSize = 800

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)
          const compressed = canvas.toDataURL("image/jpeg", 0.8)
          resolve(compressed)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const compressed = await compressImage(file)
      setAvatarPreview(compressed)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const updateData: any = {
        ...editData,
        skills: editData.skills ? editData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        socialLinks: editData.socialLinks
      }

      if (avatarPreview) {
        updateData.avatar = avatarPreview
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        await fetchProfile()
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <p>Profile not found</p>
          </Card>
        </div>
      </div>
    )
  }

  const isInstructor = profile.role === "instructor"
  const displayAvatar = avatarPreview || profile.avatar

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:items-start">
            <div className="relative">
              {displayAvatar ? (
                    <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full overflow-hidden border-4 border-primary shrink-0">
                <img
                  src={displayAvatar}
                  alt={profile.name}
                        className="w-full h-full object-cover object-center scale-110"
                />
                    </div>
              ) : (
                    <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-primary shrink-0">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isOwnProfile && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                      variant="secondary"
                    >
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </DialogTrigger>
                      <DialogContent className="w-[90vw] sm:w-full">
                    <DialogHeader>
                      <DialogTitle>Change Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Upload Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                              className="text-sm"
                        />
                      </div>
                      {avatarPreview && (
                        <div className="flex justify-center">
                              <div className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full overflow-hidden">
                          <img
                            src={avatarPreview}
                            alt="Preview"
                                  className="w-full h-full object-cover object-center scale-110"
                          />
                              </div>
                        </div>
                      )}
                          <Button onClick={handleSaveProfile} className="w-full text-sm">
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
                </div>
            </div>

              {/* Profile Info Section */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Name and Role */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
                      <h1 className="text-2xl sm:text-3xl font-bold truncate">{profile.name}</h1>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium capitalize w-fit">
                      {profile.role}
                    </span>
                  </div>

                    {/* Bio */}
                  {profile.bio && (
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">{profile.bio}</p>
                  )}
                  
                    {/* Contact Info - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {profile.email && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-4 h-4 shrink-0" />
                          <span className="truncate">{profile.phone}</span>
                      </div>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-primary min-w-0 truncate"
                      >
                          <Globe className="w-4 h-4 shrink-0" />
                          <span className="truncate">Website</span>
                      </a>
                    )}
                  </div>

                    {/* Skills - Responsive */}
                  {isInstructor && profile.skills && profile.skills.length > 0 && (
                      <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                              className="px-2 sm:px-3 py-1 bg-muted rounded-full text-xs sm:text-sm whitespace-nowrap"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Social Links */}
                  {profile.socialLinks && (
                      <div className="flex gap-2 sm:gap-3">
                      {profile.socialLinks.twitter && (
                        <a
                          href={profile.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                  {/* Edit Button */}
                {isOwnProfile && (
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Edit Profile</span>
                          <span className="sm:hidden">Edit</span>
                      </Button>
                    </DialogTrigger>
                      <DialogContent className="w-[90vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                            <Label className="text-xs sm:text-sm">Name</Label>
                          <Input
                            value={editData.name || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                              className="text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                            <Label className="text-xs sm:text-sm">Bio</Label>
                          <Textarea
                            value={editData.bio || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, bio: e.target.value })
                            }
                            rows={4}
                              className="text-xs sm:text-sm"
                          />
                        </div>
                        {isInstructor && (
                          <div>
                              <Label className="text-xs sm:text-sm">Skills (comma separated)</Label>
                            <Input
                              value={editData.skills || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, skills: e.target.value })
                              }
                              placeholder="React, Node.js, TypeScript"
                                className="text-xs sm:text-sm"
                            />
                          </div>
                        )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                              <Label className="text-xs sm:text-sm">Phone</Label>
                            <Input
                              value={editData.phone || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, phone: e.target.value })
                              }
                                className="text-xs sm:text-sm"
                            />
                          </div>
                          <div>
                              <Label className="text-xs sm:text-sm">Location</Label>
                            <Input
                              value={editData.location || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, location: e.target.value })
                              }
                                className="text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                            <Label className="text-xs sm:text-sm">Website</Label>
                          <Input
                            value={editData.website || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, website: e.target.value })
                            }
                              className="text-xs sm:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Social Links</Label>
                          <Input
                            placeholder="Twitter URL"
                            value={editData.socialLinks?.twitter || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                socialLinks: {
                                  ...editData.socialLinks,
                                  twitter: e.target.value
                                }
                              })
                            }
                              className="text-xs sm:text-sm"
                          />
                          <Input
                            placeholder="LinkedIn URL"
                            value={editData.socialLinks?.linkedin || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                socialLinks: {
                                  ...editData.socialLinks,
                                  linkedin: e.target.value
                                }
                              })
                            }
                              className="text-xs sm:text-sm"
                          />
                          <Input
                            placeholder="GitHub URL"
                            value={editData.socialLinks?.github || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                socialLinks: {
                                  ...editData.socialLinks,
                                  github: e.target.value
                                }
                              })
                            }
                              className="text-xs sm:text-sm"
                          />
                        </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={handleSaveProfile} className="flex-1 text-xs sm:text-sm">
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                              className="flex-1 text-xs sm:text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </Card>

          {/* Instructor Stats - Responsive Grid */}
        {isInstructor && profile.instructorStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                    ${profile.instructorStats.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Students</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">
                    {profile.instructorStats.totalStudents}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">
                    {profile.instructorStats.totalCourses}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">
                    {profile.instructorStats.avgRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

          {/* Tabs - Responsive */}
        <Tabs defaultValue={isInstructor ? "courses" : "enrollments"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            {isInstructor ? (
              <>
                <TabsTrigger value="courses" className="text-xs sm:text-sm">My Courses</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
                <TabsTrigger value="students" className="text-xs sm:text-sm hidden sm:inline-flex">Students</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs sm:text-sm hidden sm:inline-flex">Settings</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="enrollments" className="text-xs sm:text-sm">My Courses</TabsTrigger>
                <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certs</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm hidden sm:inline-flex">Reviews</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs sm:text-sm hidden sm:inline-flex">Settings</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Student: Enrollments */}
          {!isInstructor && (
            <TabsContent value="enrollments" className="mt-4 sm:mt-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">My Enrolled Courses</h2>
                {profile.enrollments && profile.enrollments.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {profile.enrollments.map((enrollment: any) => (
                      <div
                        key={enrollment.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={enrollment.course.thumbnail || "/placeholder.svg"}
                          alt={enrollment.course.title}
                          className="w-full sm:w-24 h-32 sm:h-24 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{enrollment.course.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {enrollment.course.category}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm">Progress</span>
                              <span className="text-xs sm:text-sm font-medium">
                                {enrollment.progress.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm" className="w-full sm:w-auto shrink-0 text-xs sm:text-sm">
                          <Link href={`/dashboard/courses/${enrollment.course.id}`}>
                            Continue
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No enrolled courses yet.</p>
                )}
              </Card>
            </TabsContent>
          )}

          {/* Student: Certificates */}
          {!isInstructor && (
            <TabsContent value="certificates" className="mt-4 sm:mt-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">My Certificates</h2>
                {profile.certificates && profile.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {profile.certificates.map((cert: any) => (
                      <Card key={cert.id} className="p-4 flex flex-col">
                        <div className="text-center flex-1">
                          <Award className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold mb-1 text-sm sm:text-base line-clamp-2">{cert.course.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                          Issued {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                        </div>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handleDownloadCertificate(cert.id, cert.course.title)}
                            disabled={downloadingCertId === cert.id}
                            size="sm" 
                            className="w-full bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {downloadingCertId === cert.id ? 'Downloading...' : 'Download PDF'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No certificates yet. Complete a course to earn your first certificate! 🎓
                  </p>
                )}
              </Card>
            </TabsContent>
          )}

          {/* Instructor: Courses */}
          {isInstructor && (
            <TabsContent value="courses" className="mt-4 sm:mt-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">My Courses</h2>
                {profile.taughtCourses && profile.taughtCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {profile.taughtCourses.map((course: any) => (
                      <Card key={course.id} className="overflow-hidden flex flex-col">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-24 sm:h-32 object-cover"
                        />
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">{course.title}</h3>
                          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 grow">
                            <span>{course.studentCount} students</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm" asChild>
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                              Manage
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No courses created yet.</p>
                )}
              </Card>
            </TabsContent>
          )}

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-4 sm:mt-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                {isInstructor ? "Course Reviews" : "My Reviews"}
              </h2>
              {profile.reviews && profile.reviews.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {profile.reviews.map((review: any) => (
                    <div key={review.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {isInstructor ? review.course?.title : review.course?.title}
                          </h3>
                          {!isInstructor && review.user && (
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              by {review.user.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </Card>
          </TabsContent>

          {/* Instructor: Students */}
          {isInstructor && (
            <TabsContent value="students" className="mt-4 sm:mt-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">My Students</h2>
                <p className="text-sm text-muted-foreground">
                  Student management features coming soon...
                </p>
              </Card>
            </TabsContent>
          )}

          {/* Settings */}
          <TabsContent value="settings" className="mt-4 sm:mt-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Settings</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">Notifications</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-none">
                        Manage your notification preferences
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto shrink-0">
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">Privacy</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-none">
                        Control your privacy settings
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto shrink-0">
                    Configure
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}

