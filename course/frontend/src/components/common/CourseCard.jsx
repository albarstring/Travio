import { Link } from 'react-router-dom'
import { Star, Users, Clock } from 'lucide-react'

const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={course.thumbnail || '/placeholder-course.jpg'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">{course.category?.name || 'Umum'}</span>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span>{course.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold leading-tight line-clamp-2 text-slate-900">
          {course.title}
        </h2>
        <p className="text-sm text-slate-600 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course._count?.enrollments || course.totalStudents || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {Math.floor((course.duration || 0) / 60)}h
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-bold text-primary">
            {course.price > 0 ? formatPrice(course.price) : 'Gratis'}
          </div>
          <span className="text-sm font-medium text-slate-600">Selengkapnya →</span>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard

