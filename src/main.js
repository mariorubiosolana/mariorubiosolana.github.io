import './project-navigation.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playSiteIntro } from './site-intro.js'

gsap.registerPlugin(ScrollTrigger)

const media = gsap.matchMedia()
let disposed = false

media.add({
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
}, ({ conditions }) => {
  if (conditions.reducedMotion) return
  const minimumScale = conditions.desktop ? .96 : .98

  document.querySelectorAll('.home-project-cover').forEach(cover => {
    gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: cover.closest('.home-project'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(cover, { scale: minimumScale }, { scale: 1 })
      .to(cover, { scale: minimumScale })
  })
})

const disposeIntro = playSiteIntro()
Promise.allSettled([
  ...[...document.querySelectorAll('.home-project img')].map(image => image.decode()),
  document.fonts.ready,
]).then(() => { if (!disposed) ScrollTrigger.refresh() })

if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true
  disposeIntro()
  media.revert()
})
