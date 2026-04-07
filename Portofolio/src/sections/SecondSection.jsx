const HIGHLIGHTS = [
  { label: 'Domisili', value: 'Bandung, Indonesia' },
  { label: 'Pendidikan', value: 'S1 Teknik Informatika' },
  { label: 'Status', value: 'Open to Work' },
  { label: 'Bahasa', value: 'Indonesia · English' },
]

const STATS = [
  { number: '2+', label: 'Tahun Pengalaman' },
  { number: '10+', label: 'Proyek Selesai' },
  { number: '5+', label: 'Teknologi Dikuasai' },
]

export default function SecondSection({ className = '' }) {
  return (
    <section className={className}>
      <div className="outer">
        <div className="inner">
          <div
            className="bg"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 70% 30%, rgba(0,112,218,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,50,120,0.22) 0%, transparent 55%), linear-gradient(135deg, #07111f 0%, #0d1f3c 50%, #060e1c 100%)',
            }}
          >
            <div className="section-heading w-[min(1100px,90vw)] text-white">
              {/* Label */}
              <p className="mb-3 text-center text-sm uppercase tracking-[0.35em] text-blue-400/80">
                Tentang Saya
              </p>

              {/* Title */}
              <h2 className="text-center text-[clamp(2rem,5vw,3.8rem)] font-bold leading-tight">
                Kenali Lebih Dekat
              </h2>

              {/* Main grid */}
              <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">

                {/* Left — Avatar + stats */}
                <div className="flex flex-col items-center gap-6">
                  {/* Avatar placeholder */}
                  <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-xl shadow-blue-900/30 ring-1 ring-blue-500/20 md:h-60 md:w-60">
                    <div className="flex h-full w-full items-center justify-center text-6xl text-white/20">
                      <svg viewBox="0 0 24 24" className="h-24 w-24 opacity-30" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                    {/* Glow ring */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>

                  {/* Stats row */}
                  <div className="flex w-full justify-center gap-4">
                    {STATS.map(({ number, label }) => (
                      <div key={label} className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/5 py-3 px-2 text-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-blue-300">{number}</span>
                        <span className="mt-1 text-[0.65rem] uppercase tracking-wider text-white/50">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — Bio + highlights */}
                <div className="flex flex-col gap-5 text-left">
                  <p className="text-base leading-8 text-white/75">
                    Halo! Saya <span className="font-semibold text-white">Rizqi Zulmiazta Albar</span>, seorang
                    Frontend Developer yang bersemangat membangun antarmuka web yang
                    responsif, cepat, dan estetis. Saya menikmati setiap proses mulai
                    dari desain UI hingga implementasi kode yang bersih dan terstruktur.
                  </p>
                  <p className="text-base leading-8 text-white/75">
                    Saat tidak sedang coding, saya aktif mengeksplorasi teknologi baru,
                    berkontribusi pada proyek open-source, dan terus mengasah skill
                    melalui kursus serta proyek nyata.
                  </p>

                  {/* Highlight cards */}
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    {HIGHLIGHTS.map(({ label, value }) => (
                      <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                        <p className="text-[0.68rem] uppercase tracking-widest text-blue-400/70">{label}</p>
                        <p className="mt-0.5 text-sm font-medium text-white/90">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
