import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './project-navigation.js'

gsap.registerPlugin(ScrollTrigger)
const media = gsap.matchMedia()

// Intrinsic image dimensions reserve the full layout, including lazy images.
media.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('.ct-image').forEach(figure => {
    const cover = figure.classList.contains('ct-cover')
    const image = figure.querySelector('img')
    gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: figure,
        start: 'top 115%',
        end: 'bottom -15%',
        scrub: 1.6,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(image, { scale: cover ? .92 : .9 }, { scale: 1 })
      .to(image, { scale: cover ? .94 : .9 })
  })
})

if (import.meta.hot) import.meta.hot.dispose(() => media.revert())
