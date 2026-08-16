const isPreview =
  typeof window !== 'undefined' &&
  Boolean(new URLSearchParams(window.location.search).has('preview'))

const getResourceName = () => {
  try {
    return window.GetParentResourceName ? window.GetParentResourceName() : 'qb-multicharacter'
  } catch {
    return 'qb-multicharacter'
  }
}

export async function fetchNui(eventName, data = {}) {
  if (isPreview) return null
  const resp = await fetch(`https://${getResourceName()}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data),
  })
  if (!resp.ok) return null
  try {
    return await resp.json()
  } catch {
    return null
  }
}
