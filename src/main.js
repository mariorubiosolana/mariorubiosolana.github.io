import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playSiteIntro } from './site-intro.js'

gsap.registerPlugin(ScrollTrigger)

// SCROLL ANIMATIONS
const media = gsap.matchMedia()
let disposed = false

media.add({
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
}, ({ conditions }) => {
  if (conditions.reducedMotion) return
  const { desktop } = conditions

  // HERO
  const hero = document.querySelector('.hero')
  const name = hero.querySelector('h1')
  const maximumScale = () => Math.min(
    desktop ? 1.26 : 1.16,
    (hero.clientWidth - 32) / name.offsetWidth,
  )

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: desktop ? '+=115%' : '+=80%',
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
    .fromTo(name,
      { opacity: 0, scale: .9, y: 0 },
      { opacity: 1, scale: maximumScale, duration: .5 }, 0,
    )
    .fromTo('.hero-subtitle',
      { opacity: .35, y: 0 },
      { opacity: .65, y: -6, duration: .5 }, 0,
    )
    .to(name, { opacity: 0, y: desktop ? -48 : -24, duration: .38 }, .62)
    .to('.hero-subtitle', { opacity: 0, y: desktop ? -22 : -12, duration: .38 }, .62)

  // PROJECTS
  const coverScale = desktop ? 70 / 90 : .9
  const lineScene = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.line-stage',
      start: desktop ? 'top top' : 'top 65%',
      end: desktop ? '+=110%' : 'bottom 30%',
      pin: desktop,
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
  lineScene.fromTo('.line-media', { scale: coverScale }, { scale: 1, duration: 1 }, 0)
  if (desktop) {
    lineScene.to('.project-line .project-heading', { opacity: 0, y: -16, duration: .45 }, .4)
  }

  gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: {
      trigger: '.project-factory', start: 'top bottom', end: 'bottom top',
      scrub: true, invalidateOnRefresh: true,
    },
  })
    .fromTo('.factory-media', { scale: coverScale }, { scale: 1 })
    .to('.factory-media', { scale: coverScale })

  gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: {
      trigger: '.project-house', start: 'top bottom', end: 'bottom top',
      scrub: true, invalidateOnRefresh: true,
    },
  })
    .fromTo('.house-media', { scale: coverScale }, { scale: 1 })
    .to('.house-media', { scale: coverScale })

  gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: {
      trigger: '.project-third', start: 'top bottom', end: 'bottom top',
      scrub: true, invalidateOnRefresh: true,
    },
  })
    .fromTo('.third-media', { scale: coverScale }, { scale: 1 })
    .to('.third-media', { scale: coverScale })
})

const disposeIntro = playSiteIntro()
Promise.allSettled([...document.querySelectorAll('.home-project-cover img')].map(image => image.decode()))
  .then(() => { if (!disposed) ScrollTrigger.refresh() })
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true
  disposeIntro()
  media.revert()
})
