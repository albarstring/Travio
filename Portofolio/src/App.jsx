import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import './App.css'
import PageHeader from './sections/PageHeader'
import FirstSection from './sections/FirstSection'
import SecondSection from './sections/SecondSection'
import ThirdSection from './sections/ThirdSection'
import FourthSection from './sections/FourthSection'
import FifthSection from './sections/FifthSection'

export default function App() {
  const heroRef = useRef(null)
  const normalRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(Observer)

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray('.gsap-panel')
      const images = gsap.utils.toArray('.gsap-panel .bg')
      const headings = gsap.utils.toArray('.gsap-panel .section-heading')
      const outerWrappers = gsap.utils.toArray('.gsap-panel .outer')
      const innerWrappers = gsap.utils.toArray('.gsap-panel .inner')

      let currentIndex = -1
      let animating = false
      let observer
      let inNormalScroll = false
      let restoringToGsap = false

      gsap.set(outerWrappers, { yPercent: 100 })
      gsap.set(innerWrappers, { yPercent: -100 })

      function showNormalSections() {
        inNormalScroll = true
        observer?.disable()

        gsap.to(heroRef.current, {
          autoAlpha: 0,
          pointerEvents: 'none',
          duration: 0.35,
        })

        normalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      function restoreGsapSections() {
        if (restoringToGsap) return
        restoringToGsap = true

        inNormalScroll = false
        observer?.disable()

        gsap.set(sections, { autoAlpha: 0, zIndex: 0 })
        gsap.set(outerWrappers, { yPercent: 100 })
        gsap.set(innerWrappers, { yPercent: -100 })
        currentIndex = -1

        gsap.to(heroRef.current, {
          autoAlpha: 1,
          pointerEvents: 'auto',
          duration: 0.45,
          ease: 'power2.out',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })

        gsap.delayedCall(0.25, () => {
          gotoSection(sections.length - 1, -1)
          gsap.delayedCall(0.9, () => {
            restoringToGsap = false
          })
        })

        gsap.delayedCall(1.2, () => {
          restoringToGsap = false
        })
      }

      function gotoSection(index, direction) {
        if (animating) return

        if (index > sections.length - 1) {
          showNormalSections()
          return
        }

        if (index < 0) return

        animating = true

        const fromTop = direction === -1
        const dFactor = fromTop ? -1 : 1
        observer?.disable()
        const tl = gsap.timeline({
          defaults: { duration: 1.25, ease: 'power1.inOut' },
          onComplete: () => {
            gsap.delayedCall(0.2, () => {
              animating = false
              observer?.enable()
            })
          },
        })

        if (currentIndex >= 0) {
          gsap.set(sections[currentIndex], { zIndex: 0 })
          tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(sections[currentIndex], { autoAlpha: 0 })
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 })

        tl.fromTo(
          [outerWrappers[index], innerWrappers[index]],
          { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
          { yPercent: 0 },
          0,
        )
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
          .fromTo(
            headings[index],
            { autoAlpha: 0, yPercent: 120 * dFactor },
            { autoAlpha: 1, yPercent: 0, duration: 1, ease: 'power2.out' },
            0.2,
          )

        currentIndex = index
      }

      observer = Observer.create({
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onDown: () => !animating && !inNormalScroll && gotoSection(currentIndex - 1, -1),
        onUp: () => !animating && !inNormalScroll && gotoSection(currentIndex + 1, 1),
        tolerance: 14,
        preventDefault: true,
      })

      const handleScroll = () => {
        if (window.scrollY <= 10 && inNormalScroll) {
          restoreGsapSections()
        }
      }

      const handleWheelBack = (event) => {
        if (!inNormalScroll || restoringToGsap) return

        const normalTop = normalRef.current?.getBoundingClientRect().top ?? 0
        const isAtBoundaryTop = normalTop >= -4

        if (event.deltaY < 0 && isAtBoundaryTop) {
          event.preventDefault()
          restoreGsapSections()
        }
      }

      window.addEventListener('scroll', handleScroll)
      window.addEventListener('wheel', handleWheelBack, { passive: false })

      gotoSection(0, 1)

      return () => {
        observer.kill()
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('wheel', handleWheelBack)
      }
    })

    return () => {
      context.revert()
    }
  }, [])

  return (
    <>
      <PageHeader />

      <div ref={heroRef} className="gsap-shell">
        <FirstSection className="gsap-panel" />
        <SecondSection className="gsap-panel" />
        <ThirdSection className="gsap-panel" />
      </div>

      <main ref={normalRef} className="normal-sections">
        <FourthSection />
        <FifthSection />
      </main>
    </>
  )
}
