"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Users, Play, Search } from "lucide-react"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch published courses (default behavior)
        const response = await fetch('/api/courses')
        const data = await response.json()
        // Filter only published courses (double check)
        const publishedCourses = data.filter((c: any) => c.isPublished === true)
        setCourses(publishedCourses)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const categories = ["all", ...new Set(courses.map((c: any) => c.category))]

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedCourses = [...filteredCourses].sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default: // popular
        return b.studentCount - a.studentCount
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                E
              </div>
              <span className="font-bold">EduLearn</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <section className="py-8 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">All Courses</h1>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-auto px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="group">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video bg-muted overflow-hidden relative flex items-center justify-center">
                      <img
                        src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                        alt={course.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        style={{ 
                          objectPosition: 'center',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                        <h3 className="font-bold text-lg mt-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({course.reviewCount})</span>
                          </div>
                          <span className="text-lg font-bold">${course.price}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {course.studentCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {course.sections ? course.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) : 0} lessons
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
