import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './project-navigation.js'

gsap.registerPlugin(ScrollTrigger)
const media = gsap.matchMedia()

media.add({
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
}, ({ conditions }) => {
  if (conditions.reducedMotion) return
  document.querySelectorAll('.hc-image').forEach(figure => {
    const quiet = figure.matches('.hc-cover, .hc-model')
    const space = figure.classList.contains('hc-space')
    const small = quiet ? .92 : .9
    const slow = quiet || space
    const image = figure.querySelector('img')
    gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: figure,
        start: slow ? 'top 110%' : 'top bottom',
        end: slow ? 'bottom -10%' : 'bottom top',
        scrub: conditions.mobile ? .8 : slow ? 1.6 : 1.2,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(image, { scale: small }, { scale: 1 })
      .to(image, { scale: space ? .92 : small })
  })
})

if (import.meta.hot) import.meta.hot.dispose(() => media.revert())
