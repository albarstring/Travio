"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, AlertCircle, MapPin, Loader2 } from "lucide-react"
import { getSession, setSession } from "@/lib/auth"
import { getAuthHeaders } from "@/lib/api-helpers"
import { Navbar } from "@/components/navbar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PhoneInput } from "@/components/phone-input"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [session, setSessionState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")

  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    phoneCountryCode: "+62",
    location: "",
    linkedin: "",
    skills: "",
    role: "student"
  })

  useEffect(() => {
    const currentSession = getSession()
    if (!currentSession) {
      router.push("/login")
      return
    }
    setSessionState(currentSession)
    setFormData(prev => ({ ...prev, role: currentSession.role || "student" }))
    setIsLoading(false)
  }, [router])

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

  const getLocationFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    // For development, return coordinates directly to avoid API issues
    // In production, you can re-enable the geocoding API
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    
    /*
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EduLearn App' // Required by Nominatim
          }
        }
      )
      const data = await response.json()
      
      if (data.address) {
        const parts = []
        if (data.address.city) parts.push(data.address.city)
        else if (data.address.town) parts.push(data.address.town)
        else if (data.address.village) parts.push(data.address.village)
        
        if (data.address.state) parts.push(data.address.state)
        if (data.address.country) parts.push(data.address.country)
        
        return parts.join(", ") || data.display_name || `${lat}, ${lng}`
      }
      return `${lat}, ${lng}`
    } catch (error) {
      console.error("Error getting location name:", error)
      return `${lat}, ${lng}`
    }
    */
  }

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    setLocationError("")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const locationName = await getLocationFromCoordinates(latitude, longitude)
          setFormData({ ...formData, location: locationName })
          setIsGettingLocation(false)
        } catch (error) {
          setLocationError("Failed to get location name")
          setIsGettingLocation(false)
        }
      },
      (error) => {
        let errorMessage = "Failed to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const updateData: any = {
        bio: formData.bio,
        phone: formData.phone || null,
        location: formData.location || null,
        socialLinks: {
          linkedin: formData.linkedin || null
        }
      }

      if (avatarPreview) {
        updateData.avatar = avatarPreview
      }

      if (formData.role === "instructor" && formData.skills) {
        updateData.skills = JSON.stringify(
          formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        )
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      // Update session with new profile data
      const updatedUser = await response.json()
      const newSession = {
        ...session,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        location: updatedUser.location
      }
      setSession(newSession)

      // Redirect to home page (root) instead of role-specific pages
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to complete profile")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="flex items-center gap-2 mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Let's set up your profile to get started. Fill in the details below.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {avatarPreview ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                      className="w-full h-full object-cover object-center scale-110"
                  />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold border-4 border-primary">
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  variant="secondary"
                  onClick={() => setShowAvatarDialog(true)}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Upload a profile picture (optional but recommended)
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                Bio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your interests, and what you'd like to learn..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                required
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                countryCode={formData.phoneCountryCode}
                onCountryCodeChange={(code) => setFormData({ ...formData, phoneCountryCode: code })}
                placeholder="81234567890"
              />
              <p className="text-xs text-muted-foreground">
                Your phone number will be kept private
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleShareLocation}
                  disabled={isGettingLocation}
                  className="shrink-0"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Share Location
                    </>
                  )}
                </Button>
              </div>
              {locationError && (
                <p className="text-xs text-destructive">{locationError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Click "Share Location" to automatically detect your location, or type it manually
              </p>
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin || ""}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Your LinkedIn profile URL (optional)
              </p>
            </div>

            {/* Skills (for instructor) */}
            {formData.role === "instructor" && (
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  type="text"
                  placeholder="React, Node.js, TypeScript, Python"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  List your skills separated by commas. This helps students find you.
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Choose Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2"
              />
            </div>
            {avatarPreview && (
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={avatarPreview}
                  alt="Preview"
                    className="w-full h-full object-cover object-center scale-110"
                />
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAvatarDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowAvatarDialog(false)}
                className="flex-1"
              >
                Use This Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

