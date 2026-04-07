import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const galleryImages = [
  'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
  'https://assets.codepen.io/16327/portrait-image-12.jpg',
  '/dist/image.png',
  'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
  'https://assets.codepen.io/16327/portrait-image-4.jpg',
  'https://assets.codepen.io/16327/portrait-image-3.jpg',
  'https://assets.codepen.io/16327/portrait-pattern-3.jpg',
  'https://assets.codepen.io/16327/portrait-image-1.jpg',
]

export default function FifthSection() {
  const sectionRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip)

    let flipCtx

    const createTween = () => {
      const galleryElement = galleryRef.current
      if (!galleryElement) return

      const galleryItems = galleryElement.querySelectorAll('.gallery__item')
      flipCtx?.revert()
      galleryElement.classList.remove('gallery--final')

      flipCtx = gsap.context(() => {
        galleryElement.classList.add('gallery--final')
        const flipState = Flip.getState(galleryItems)
        galleryElement.classList.remove('gallery--final')

        const flip = Flip.to(flipState, {
          simple: true,
          ease: 'expoScale(1, 5)',
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'project-gallery-flip',
            trigger: galleryElement,
            start: 'center center',
            end: '+=100%',
            scrub: true,
            pin: galleryElement.parentNode,
          },
        })

        tl.add(flip)

        return () => gsap.set(galleryItems, { clearProps: 'all' })
      }, sectionRef)
    }

    createTween()
    window.addEventListener('resize', createTween)

    return () => {
      window.removeEventListener('resize', createTween)
      flipCtx?.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === 'project-gallery-flip') trigger.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-slate-900 text-white">
      <div className="gallery-wrap">
        <div ref={galleryRef} className="gallery gallery--bento gallery--switch" id="gallery-8">
          {galleryImages.map((image, index) => (
            <div className="gallery__item" key={index}>
              <img src={image} alt="ITQOM project preview" />
            </div>
          ))}
        </div>
      </div>

      <div className="project-section-copy mx-auto w-full max-w-5xl px-6 py-16 md:px-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">Section 5</p>
        <h2 className="mb-6 text-4xl font-bold md:text-6xl">Project: ITQOM</h2>
        <p>
          ITQOM adalah project platform Course Online yang saya bangun untuk memudahkan pengguna belajar secara terstruktur,
          fleksibel, dan interaktif. Pengguna dapat mengakses materi berdasarkan kelas, melihat progres pembelajaran, dan
          mengikuti alur belajar yang jelas dari dasar hingga lanjutan.
        </p>
        <p>
          Dalam project ini, saya berfokus pada pengalaman pengguna yang simpel namun tetap modern, mulai dari desain
          antarmuka, organisasi konten, hingga performa tampilan agar nyaman digunakan di desktop maupun mobile.
        </p>
        <p>
          ITQOM dirancang sebagai solusi pembelajaran digital yang tidak hanya berfungsi sebagai tempat menyimpan materi,
          tetapi juga sebagai ekosistem belajar yang mendorong konsistensi, pemahaman, dan kemajuan user secara nyata.
        </p>
      </div>
    </section>
  )
}
