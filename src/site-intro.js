import { gsap } from 'gsap'

export function playSiteIntro() {
  const root = document.documentElement
  const overlay = document.querySelector('.site-intro')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  clearTimeout(window.siteIntroFallback)
  if (!overlay || !root.classList.contains('intro-pending') || reducedMotion.matches) {
    root.classList.remove('intro-pending')
    return () => {}
  }

  let timeline
  let timeout
  const preventScroll = (event) => event.preventDefault()
  const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '])
  const onKey = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') finish()
    else if (scrollKeys.has(event.key)) event.preventDefault()
  }
  const onMotionChange = () => { if (reducedMotion.matches) finish() }

  function finish() {
    timeline?.kill()
    clearTimeout(timeout)
    root.classList.remove('intro-pending')
    window.removeEventListener('wheel', preventScroll)
    window.removeEventListener('touchmove', preventScroll)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('pagehide', finish)
    reducedMotion.removeEventListener('change', onMotionChange)
    try { sessionStorage.setItem('introPlayed', 'true') } catch { /* Optional storage. */ }
  }

  // Block input only during the intro, without changing document geometry,
  // scroll position, overflow styles, or the existing ScrollTriggers.
  window.addEventListener('wheel', preventScroll, { passive: false })
  window.addEventListener('touchmove', preventScroll, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('pagehide', finish)
  reducedMotion.addEventListener('change', onMotionChange)
  timeout = setTimeout(finish, 3400)

  timeline = gsap.timeline({ onComplete: finish })
    .to(overlay.querySelector('.site-intro__line'), { scaleX: 1, duration: .7, ease: 'power2.out' }, .2)
    .to(overlay.querySelector('.site-intro__label'), { opacity: 1, y: 0, duration: .55, ease: 'power2.out' }, .65)
    .to(overlay.querySelector('.site-intro__content'), { opacity: 0, duration: .5, ease: 'power1.out' }, 2.2)
    .to(overlay, { opacity: 0, duration: .5, ease: 'power1.out' }, 2.45)

  return finish
}
