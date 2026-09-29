import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './project-navigation.js'

gsap.registerPlugin(ScrollTrigger)

// Wait for every real image before measuring triggers. Failed assets must not
// leave a figure (or a horizontal scene) reserving blank space.
const pendingImages = [...document.querySelectorAll('.drawing img')].map(async (image) => {
  try {
    await image.decode()
  } catch {
    if (!image.naturalWidth) {
      const figure = image.closest('figure')
      const scene = figure?.closest('.long-scene')
      ;(scene || figure)?.remove()
    }
  }
})

const media = gsap.matchMedia()
let disposed = false

function setupMotion() {
  if (disposed) return
  media.add({
    desktop: '(min-width: 768px)',
    mobile: '(max-width: 767px)',
    reducedMotion: '(prefers-reduced-motion: reduce)',
  }, ({ conditions }) => {
    if (conditions.reducedMotion) return
    const { desktop } = conditions
    const smallScale = desktop ? .88 : .94

    const statement = document.querySelector('.project-statement')
    if (statement) {
      gsap.fromTo(statement.querySelector('.project-statement-content'),
        { opacity: .45, y: 24 },
        {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: {
            trigger: statement, start: 'top bottom', end: 'center center',
            scrub: .5, invalidateOnRefresh: true,
          },
        },
      )
    }

    // The figure stays in flow; only its contents transform, keeping trigger
    // measurements stable. Equal halves put maximum scale at viewport center.
    document.querySelectorAll('.project-scroll-image').forEach((figure) => {
      const content = figure.firstElementChild
      gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: figure, start: 'top bottom', end: 'bottom top',
          scrub: true, invalidateOnRefresh: true,
        },
      })
        .fromTo(content, { scale: smallScale, transformOrigin: 'center center' }, { scale: 1 })
        .to(content, { scale: smallScale })
    })

    const scene = document.querySelector('.long-scene')
    if (!scene) return
    const viewport = scene.querySelector('.long-viewport')
    const track = scene.querySelector('.drawing-long')
    // Both breakpoints share one pin, recreated by matchMedia when needed.
    if (!track.querySelector('img')) return

    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
    if (!distance()) return
    scene.classList.add('is-pinned')
    viewport.scrollLeft = 0
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene, start: 'center center',
        end: () => `+=${Math.max(1, distance())}`,
        pin: true, pinSpacing: true, scrub: true,
        // Measure the pin before downstream image triggers on every refresh.
        refreshPriority: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    })
      .fromTo(viewport, { scale: .9 }, { scale: 1, duration: .1 })
      .fromTo(track, { x: 0 }, { x: () => -distance(), duration: .8 })
      .to(viewport, { scale: .9, duration: .1 })

    return () => {
      scene.classList.remove('is-pinned')
      viewport.scrollLeft = 0
    }
  })
  ScrollTrigger.refresh()
}

// Image decoding/removal completes before initialization and its final refresh.
Promise.allSettled(pendingImages).then(setupMotion)
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true
  media.revert()
})
