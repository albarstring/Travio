import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FourthSection() {
  const sectionRef = useRef(null)
  const initialContainerRef = useRef(null)
  const secondMarkerRef = useRef(null)
  const thirdMarkerRef = useRef(null)
  const boxRef = useRef(null)
  const boxYearRef = useRef(null)
  const boxTitleRef = useRef(null)
  const finalSpacerRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(Flip, ScrollTrigger)

    const context = gsap.context(() => {
      const createTimeline = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id === 'education-flip') trigger.kill()
        })

        const box = boxRef.current
        const boxYear = boxYearRef.current
        const boxTitle = boxTitleRef.current
        const initialContainer = initialContainerRef.current
        const secondMarker = secondMarkerRef.current
        const thirdMarker = thirdMarkerRef.current
        const finalSpacer = finalSpacerRef.current

        if (!box || !boxYear || !boxTitle || !initialContainer || !secondMarker || !thirdMarker || !finalSpacer) return

        const educationItems = [
          { year: '2023 - Present', title: 'S1 Informatika' },
          { year: '2020 - 2023', title: 'SMAN 03 Kota Serang' },
          { year: '2017 - 2020', title: 'SMPN 06 Kota Serang' },
        ]

        let activeIndex = -1
        const setBoxContent = (index) => {
          if (activeIndex === index) return
          activeIndex = index
          boxYear.textContent = educationItems[index].year
          boxTitle.textContent = educationItems[index].title
        }

        const updateByNearestTarget = () => {
          const boxRect = box.getBoundingClientRect()
          const boxCenterX = boxRect.left + boxRect.width / 2
          const boxCenterY = boxRect.top + boxRect.height / 2

          const targets = [initialContainer, secondMarker, thirdMarker]
          let nearestIndex = 0
          let nearestDistance = Number.POSITIVE_INFINITY

          targets.forEach((element, index) => {
            const rect = element.getBoundingClientRect()
            const targetCenterX = rect.left + rect.width / 2
            const targetCenterY = rect.top + rect.height / 2
            const distance = Math.hypot(boxCenterX - targetCenterX, boxCenterY - targetCenterY)

            if (distance < nearestDistance) {
              nearestDistance = distance
              nearestIndex = index
            }
          })

          setBoxContent(nearestIndex)
        }

        setBoxContent(0)

        const secondState = Flip.getState(secondMarker)
        const thirdState = Flip.getState(thirdMarker)

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'education-flip',
            trigger: initialContainer,
            start: 'clamp(top center)',
            endTrigger: finalSpacer,
            end: 'clamp(top center)',
            scrub: 1,
            onUpdate: updateByNearestTarget,
            onRefresh: updateByNearestTarget,
          },
        })

        tl.add(Flip.fit(box, secondState, { ease: 'none', duration: 1, absolute: true })).add(
          Flip.fit(box, thirdState, { ease: 'none', duration: 1, absolute: true }),
          '+=0.5',
        )
      }

      createTimeline()
      window.addEventListener('resize', createTimeline)

      return () => {
        window.removeEventListener('resize', createTimeline)
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id === 'education-flip') trigger.kill()
        })
      }
    }, sectionRef)

    return () => context.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-slate-950 px-6 py-10 text-white"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 2px, transparent 2px), linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="spacer flex h-[20vh] items-center justify-center text-sm uppercase tracking-[0.3em] text-white/60">
          Scroll down
        </div>

        <h2 className="mb-8 text-center text-4xl font-bold md:text-6xl">Pendidikan</h2>

        <div className="main relative min-h-[800px]">
          <div
            ref={initialContainerRef}
            className="container initial absolute left-[56%] top-[10%] flex h-[150px] w-[220px] items-center justify-center rounded-xl border-2 border-dashed border-white/35"
          >
            <div
              ref={boxRef}
              className="box z-10 flex h-[110px] w-[180px] items-center justify-center rounded-lg bg-blue-500/20 p-3 text-center text-sm font-semibold"
            >
              <div>
                <p ref={boxYearRef}>2019 - 2023</p>
                <p ref={boxTitleRef}>S1 Teknik Informatika</p>
              </div>
            </div>
          </div>

          <div className="container second absolute left-[10%] top-[50%] flex h-[150px] w-[220px] items-center justify-center rounded-xl border-2 border-dashed border-white/35">
            <div
              ref={secondMarkerRef}
              className="marker flex h-[110px] w-[180px] items-center justify-center  text-center text-sm text-white/80"
            >
            </div>
          </div>

          <div className="container third absolute bottom-12 right-[10%] flex h-[150px] w-[220px] items-center justify-center rounded-xl border-2 border-dashed border-white/35">
            <div
              ref={thirdMarkerRef}
              className="marker flex h-[110px] w-[180px] items-center justify-center rounded-lg border border-white/30 p-3 text-center text-sm text-white/80"
            >
              
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-sm">
          <p className="text-sm leading-7 text-white/80 md:text-base">
            Perjalanan pendidikan saya dimulai dari SMA/SMK, dilanjutkan ke S1 Teknik Informatika, lalu berkembang lewat
            pembelajaran mandiri dan kursus berkelanjutan untuk memperdalam React, Tailwind CSS, GSAP, dan modern front-end
            engineering.
          </p>
        </div>

        <div ref={finalSpacerRef} className="spacer final h-[20vh]" />
      </div>
    </section>
  )
}
