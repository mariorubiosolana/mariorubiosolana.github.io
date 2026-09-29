function prepareHomeReturn(event) {
  const link = event.target.closest?.('a[href]')
  if (!link || event.defaultPrevented) return
  const destination = new URL(link.href, location.href)
  if (destination.origin !== location.origin || !['/', '/index.html'].includes(destination.pathname)) return
  try { sessionStorage.setItem('skipIntroOnce', 'true') } catch { /* Optional storage. */ }
}

document.addEventListener('click', prepareHomeReturn)
if (import.meta.hot) import.meta.hot.dispose(() => {
  document.removeEventListener('click', prepareHomeReturn)
})
