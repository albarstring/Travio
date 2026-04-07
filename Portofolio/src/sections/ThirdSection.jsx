const PROJECTS = [
  {
    name: 'Portfolio Website',
    summary:
      'Website personal interaktif dengan animasi scroll, layout modern, dan performa yang dioptimalkan.',
    stack: ['React', 'Tailwind', 'GSAP'],
    demo: '#',
    repo: '#',
    metric: 'Lighthouse 95+',
  },
  {
    name: 'Task Management App',
    summary:
      'Aplikasi manajemen tugas dengan fitur drag-and-drop, filter status, dan sinkronisasi data realtime.',
    stack: ['React', 'Firebase', 'Framer Motion'],
    demo: '#',
    repo: '#',
    metric: '500+ Tugas Terkelola',
  },
  {
    name: 'E-Commerce Landing Page',
    summary:
      'Landing page produk dengan fokus conversion, desain responsif, dan waktu muat yang cepat di mobile.',
    stack: ['Vite', 'Tailwind', 'JavaScript'],
    demo: '#',
    repo: '#',
    metric: 'Load time < 2s',
  },
]

export default function ThirdSection({ className = '' }) {
  return (
    <section className={className}>
      <div className="outer">
        <div className="inner">
          <div
            className="bg"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(20,90,180,0.2) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(16,50,110,0.28) 0%, transparent 45%), linear-gradient(125deg, #050913 0%, #0a1731 55%, #050b17 100%)',
            }}
          >
            <div className="section-heading w-[min(1140px,92vw)] text-white">
              <p className="mb-3 text-center text-sm uppercase tracking-[0.35em] text-blue-400/80">
                Proyek Pilihan
              </p>

              <h2 className="text-center text-[clamp(2rem,4.8vw,3.6rem)] font-bold leading-tight">
                Featured Projects
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-white/70 md:text-base">
                Beberapa karya yang merepresentasikan cara saya membangun pengalaman
                digital yang cepat, rapi, dan berfokus pada pengguna.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                {PROJECTS.map((project) => (
                  <article
                    key={project.name}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300/40 hover:bg-white/[0.08]"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80">
                      {project.metric}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {project.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/75">
                      {project.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-wider text-white/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <a
                        href={project.demo}
                        className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-blue-400"
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.repo}
                        className="inline-flex items-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/85 transition hover:border-white/35 hover:text-white"
                      >
                        GitHub
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
