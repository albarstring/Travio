import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../../store/slices/courseSlice'
import CourseCard from '../../components/common/CourseCard'
import Loading from '../../components/common/Loading'
import Skeleton from '../../components/common/Skeleton'
import { Search, Filter, X } from 'lucide-react'
import api from '../../services/api'

const CourseCatalogPage = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { courses, pagination, isLoading } = useSelector((state) => state.course)
  
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  })

  useEffect(() => {
    // Fetch categories
    api.get('/categories').then((res) => {
      setCategories(res.data.categories)
    })
  }, [])

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      ...filters,
    }
    dispatch(fetchCourses(params))
  }, [dispatch, searchParams, filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setSearchParams({ ...filters, [key]: value, page: 1 })
  }

  const clearFilters = () => {
    const cleared = {
      search: '',
      category: '',
      level: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
    setFilters(cleared)
    setSearchParams({})
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-4xl font-bold text-slate-900">Katalog Course</h1>
        <p className="text-slate-600">Temukan course yang sesuai dengan minat dan kebutuhan Anda.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Cari Course</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik kata kunci"
                className="w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Kategori</p>
            <select
              className="select select-bordered w-full"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Level</p>
            <select
              className="select select-bordered w-full"
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="">Semua Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Urutkan</p>
            <select
              className="select select-bordered w-full"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
            >
              <option value="createdAt-desc">Terbaru</option>
              <option value="rating-desc">Rating Tertinggi</option>
              <option value="totalStudents-desc">Paling Populer</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {(filters.search || filters.category || filters.level) && (
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary"
            >
              <X className="h-4 w-4" />
              Hapus filter
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" lines={2} />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center">
              <div className="join">
                {Array.from({ length: pagination.pages }).map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      className={`join-item btn ${
                        pagination.page === page ? 'btn-active' : ''
                      }`}
                      onClick={() => {
                        setSearchParams({ ...filters, page })
                      }}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-white py-12 text-center shadow-sm">
          <p className="text-lg text-slate-600">Tidak ada course yang ditemukan</p>
        </div>
      )}
    </div>
  )
}

export default CourseCatalogPage

