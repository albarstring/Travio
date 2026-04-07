import { useEffect, useState } from 'react';

const PHRASES = ['Rizqi Zulmiazta Albar', 'Frontend Developer'];
const TYPING_SPEED = 80;
const DELETING_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

export default function FirstSection({ className = '' }) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];
    let timeout;
    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
      }, PAUSE_AFTER_DELETE);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(isDeleting
          ? current.slice(0, displayText.length - 1)
          : current.slice(0, displayText.length + 1));
      }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section className={className}>
      <div className="outer">
        <div className="inner">
          <div className="bg [background-image:radial-gradient(circle_farthest-corner_at_16.5%_28.1%,rgba(15,27,49,1)_0%,rgba(0,112,218,1)_90%)]">
            <div className="section-heading grid w-[min(1120px,90vw)] grid-cols-1 items-center gap-8 text-center md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:gap-12 md:text-left">
              <div className="max-w-none md:max-w-[680px]">
                <p className="mb-4 text-sm uppercase tracking-[0.35em] text-slate-300">
                  Hello, I&apos;m
                </p>
                <h1 className="m-0 min-h-[1.2em] text-[clamp(2.2rem,6vw,5.5rem)] leading-[1.1] text-white">
                  {displayText}
                  <span className="ml-1 inline-block w-[3px] animate-[blink_0.8s_step-end_infinite] bg-white align-middle">&nbsp;</span>
                </h1>
                <p className="mt-6 max-w-none text-base leading-8 normal-case text-white/80 md:max-w-[38rem]">
                  Seorang pengembang yang mencintai teknologi dan inovasi. Saya
                  menciptakan solusi digital yang tidak hanya fungsional, tetapi
                  juga memberikan pengalaman pengguna yang luar biasa.
                </p>

                <a
                  href="/CV-Rizqi-Zulmiazta-Albar.pdf"
                  download
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-blue-100 hover:shadow-blue-300/40"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v13M7 11l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Download CV
                </a>

                <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                  <a
                    href="https://github.com/albarstring"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[1.35rem] w-[1.35rem]"
                    >
                      <path
                        d="M12 2C6.477 2 2 6.589 2 12.25c0 4.528 2.865 8.37 6.839 9.726.5.096.682-.223.682-.496 0-.245-.009-.894-.014-1.754-2.782.62-3.369-1.372-3.369-1.372-.455-1.188-1.11-1.504-1.11-1.504-.908-.637.069-.624.069-.624 1.004.073 1.532 1.057 1.532 1.057.892 1.568 2.341 1.115 2.91.852.091-.664.349-1.115.635-1.372-2.221-.26-4.555-1.14-4.555-5.076 0-1.121.389-2.037 1.029-2.755-.103-.261-.446-1.311.098-2.734 0 0 .84-.276 2.75 1.053A9.306 9.306 0 0112 6.851c.85.004 1.706.118 2.505.346 1.909-1.329 2.748-1.053 2.748-1.053.546 1.423.203 2.473.1 2.734.64.718 1.027 1.634 1.027 2.755 0 3.946-2.338 4.813-4.566 5.067.359.319.678.948.678 1.911 0 1.379-.012 2.49-.012 2.829 0 .275.18.596.688.495C19.137 20.616 22 16.776 22 12.25 22 6.589 17.523 2 12 2z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/rz-albar/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[1.35rem] w-[1.35rem]"
                    >
                      <path
                        d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A2.02 2.02 0 003.2 5.04c0 1.12.9 2.03 2.01 2.03h.03a2.03 2.03 0 10.01-4.07zM20.8 12.77c0-3.4-1.81-4.98-4.23-4.98-1.95 0-2.82 1.08-3.3 1.84V8.5H9.89c.05.75 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92.27-.67.89-1.37 1.93-1.37 1.36 0 1.91 1.05 1.91 2.58V20h3.38l.18-7.23z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <a
                    href="mailto:Albarnaga123@gmail.com"
                    aria-label="Email"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[1.35rem] w-[1.35rem]"
                    >
                      <path
                        d="M3 5.5A2.5 2.5 0 015.5 3h13A2.5 2.5 0 0121 5.5v13a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 18.5v-13zm2.2.5L12 11.1 18.8 6H5.2zm13.3 1.3l-5.75 4.31a1.25 1.25 0 01-1.5 0L5.5 7.3v11.2h13V7.3z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex justify-center">
                <img
                  className="h-56 w-56 rounded-full border border-white/20 object-cover transition-transform duration-500 hover:scale-105 shadow-xl shadow-blue-500/20 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80"
                  src="/Albar-gunung.PNG"
                  alt="Rizqi Zulmiazta Albar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
