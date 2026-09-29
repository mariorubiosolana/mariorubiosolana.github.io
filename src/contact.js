const form = document.querySelector('.contact-form')
const button = form.querySelector('.contact-send')
const status = form.querySelector('.contact-status')
let busy = false
let resetTimer
let controller

async function submitContact(event) {
  event.preventDefault()
  if (busy || !form.reportValidity()) return
  busy = true
  button.disabled = true
  button.textContent = 'SENDING...'
  status.textContent = 'SENDING...'
  form.setAttribute('aria-busy', 'true')
  const fields = [...form.querySelectorAll('input:not([hidden]), textarea')]
  const body = new FormData(form)
  fields.forEach(field => { field.readOnly = true })
  controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  function unlock() {
    busy = false
    button.disabled = false
    button.textContent = 'SEND'
    fields.forEach(field => { field.readOnly = false })
    form.removeAttribute('aria-busy')
  }

  try {
    const response = await fetch(form.action, {
      method: 'POST', body, headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('Contact submission failed')
    status.textContent = 'MESSAGE SENT'
    button.textContent = 'MESSAGE SENT'
    form.removeAttribute('aria-busy')
    resetTimer = setTimeout(() => {
      form.reset()
      unlock()
    }, 1500)
  } catch {
    status.textContent = 'SOMETHING WENT WRONG'
    unlock()
  } finally {
    clearTimeout(timeout)
  }
}

form.addEventListener('submit', submitContact)
button.disabled = false
if (import.meta.hot) import.meta.hot.dispose(() => {
  form.removeEventListener('submit', submitContact)
  clearTimeout(resetTimer)
  controller?.abort()
})
