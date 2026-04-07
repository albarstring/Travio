import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchFeaturedCourses } from '../../store/slices/courseSlice'
import CourseCard from '../../components/common/CourseCard'
import Loading from '../../components/common/Loading'
import { ArrowRight, CheckCircle, Users, Award, Clock } from 'lucide-react'

const LandingPage = () => {
  const dispatch = useDispatch()
  const { featuredCourses, isLoading } = useSelector((state) => state.course)

  useEffect(() => {
    dispatch(fetchFeaturedCourses())
  }, [dispatch])

  const benefits = [
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Belajar dari instruktur berpengalaman di bidangnya',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Dapatkan sertifikat setelah menyelesaikan course',
    },
    {
      icon: Clock,
      title: 'Lifetime Access',
      description: 'Akses seumur hidup setelah membeli course',
    },
  ]

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Software Developer',
      content: 'Platform ini sangat membantu saya meningkatkan skill programming. Materinya lengkap dan mudah dipahami.',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      role: 'UI/UX Designer',
      content: 'Course yang tersedia sangat berkualitas dan instrukturnya sangat berpengalaman. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      role: 'Data Analyst',
      content: 'Saya sudah menyelesaikan beberapa course dan sangat puas dengan hasilnya. Platform yang sangat bagus!',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'Bagaimana cara mendaftar course?',
      answer: 'Anda bisa mendaftar dengan membuat akun terlebih dahulu, kemudian pilih course yang ingin diikuti dan lakukan pembayaran.',
    },
    {
      question: 'Apakah ada sertifikat setelah menyelesaikan course?',
      answer: 'Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan semua materi dan quiz dengan nilai minimal yang ditentukan.',
    },
    {
      question: 'Berapa lama akses course?',
      answer: 'Setelah membeli course, Anda mendapatkan akses seumur hidup untuk materi course tersebut.',
    },
  ]

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">Belajar fleksibel</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
                Belajar kapan saja, di mana saja dengan mentor berpengalaman
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Tingkatkan skill Anda melalui kurasi course praktis, roadmap terarah, dan materi yang selalu diperbarui.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/courses" className="btn btn-primary btn-lg rounded-full px-6">
                  Jelajahi Course
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg rounded-full px-6">
                  Daftar Gratis
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-slate-700 sm:grid-cols-4">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 text-center">
                  <p className="text-xs text-slate-500">Instruktur</p>
                  <p className="text-lg font-semibold text-slate-900">100+ ahli</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 text-center">
                  <p className="text-xs text-slate-500">Course aktif</p>
                  <p className="text-lg font-semibold text-slate-900">1.200+</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 text-center">
                  <p className="text-xs text-slate-500">Siswa</p>
                  <p className="text-lg font-semibold text-slate-900">50K+</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 text-center">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="text-lg font-semibold text-slate-900">4.8/5</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold">UX</div>
                <div>
                  <p className="text-sm text-slate-500">Jalur Belajar</p>
                  <p className="font-semibold text-slate-900">UI/UX Fundamentals</p>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">Module 0{item}</p>
                      <p className="text-xs text-slate-500">Materi praktis & studi kasus</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                Akses seumur hidup dan update materi otomatis.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Mengapa pilih platform kami?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Fondasi yang konsisten: materi terstruktur, mentor ahli, dan dukungan komunitas agar progres belajar lebih terukur.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">Pilihan utama</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Course unggulan</h2>
              <p className="text-slate-600">Kurasi course populer dengan rating tinggi.</p>
            </div>
            <Link to="/courses" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses?.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          <div className="mt-8 flex sm:hidden justify-center">
            <Link to="/courses" className="btn btn-outline btn-sm rounded-full px-4">
              Lihat semua course
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Apa kata mereka?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Testimoni dari para profesional yang telah belajar di platform ini.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5" />
                  ))}
                </div>
                <p className="text-sm text-slate-700">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Pertanyaan umum</h2>
            <p className="text-slate-600">Informasi penting sebelum memulai.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
                    {faq.question}
                    <span className="text-slate-400 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-content">
        <div className="mx-auto max-w-6xl px-4 text-center space-y-4">
          <h2 className="text-3xl font-bold">Siap memulai perjalanan belajar Anda?</h2>
          <p className="text-lg opacity-90">
            Daftar sekarang dan dapatkan akses ke ribuan course berkualitas dengan dukungan mentor.
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg rounded-full px-6">
            Daftar gratis sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

