import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './project-navigation.js'

gsap.registerPlugin(ScrollTrigger)
const media = gsap.matchMedia()
let disposed = false

async function setup() {
  await Promise.allSettled([...document.querySelectorAll('.vv-image img')].map(image => image.decode()))
  if (disposed) return

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const scene = document.querySelector('.vv-transformation')
    scene.classList.add('is-layered')
    // One short pin holds the two layers in the same place on every viewport.
    ScrollTrigger.create({
      trigger: scene, start: 'center center', end: '+=85%',
      pin: true, pinSpacing: true, anticipatePin: 1, refreshPriority: 1,
      invalidateOnRefresh: true,
    })
    scene.querySelectorAll('.vv-layer').forEach((figure, index) => {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scene, start: 'center center', end: '+=85%',
          scrub: true, invalidateOnRefresh: true,
        },
      })
        .fromTo(figure.querySelector('img'),
          { opacity: index ? 0 : 1, scale: index ? .98 : .96 },
          { opacity: index ? 0 : 1, scale: index ? .98 : 1, duration: .2 })
        .to(figure.querySelector('img'), { opacity: index ? 1 : 0, scale: index ? 1 : 1.02, duration: .6 })
        .to(figure.querySelector('img'), { scale: index ? 1 : 1.02, duration: .2 })
    })

    document.querySelectorAll('.vv-scroll-image').forEach(figure => {
      const small = figure.classList.contains('vv-sketch') ? .92 : .88
      const steady = figure.hasAttribute('data-steady')
      const slow = figure.hasAttribute('data-slow')
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: figure,
          start: slow || steady ? 'top 110%' : 'top bottom',
          end: slow || steady ? 'bottom -10%' : 'bottom top',
          scrub: true, invalidateOnRefresh: true,
        },
      })
      timeline.fromTo(figure.querySelector('img'), { scale: small }, { scale: 1, duration: 1 })
      if (steady) timeline.to(figure.querySelector('img'), { scale: 1, duration: .45 })
      timeline.to(figure.querySelector('img'), { scale: small, duration: 1 })
    })
    return () => scene.classList.remove('is-layered')
  })
  ScrollTrigger.refresh()
}

setup()
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true
  media.revert()
})
