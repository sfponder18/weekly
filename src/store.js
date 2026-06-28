// Local, single-device persistence. Everything the tester creates — their draft
// week, the letters they write, and their connection/settings choices — lives in
// localStorage. No backend.
const KEY = 'weekly:v1'

const empty = {
  profile: { name: '', deliveryDay: 0, timezone: '', phone: '', remindersOn: true }, // deliveryDay: 0=Sun … 6=Sat
  draft: { photos: [], description: '' }, // photos: array of data-URL strings
  sentLetters: [], // { id, toId, toName, body, at }
  removedIds: [], // connections the user has removed
  acceptedIds: [], // inbound requests the user accepted
  declinedIds: [], // inbound requests the user declined
  invited: [], // outgoing pending invites: { id, name }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(empty)
    const parsed = JSON.parse(raw)
    // shallow-merge so older saves missing a field don't crash
    return {
      ...structuredClone(empty),
      ...parsed,
      profile: { ...empty.profile, ...(parsed.profile || {}) },
      draft: { ...empty.draft, ...(parsed.draft || {}) },
      sentLetters: parsed.sentLetters || [],
      removedIds: parsed.removedIds || [],
      acceptedIds: parsed.acceptedIds || [],
      declinedIds: parsed.declinedIds || [],
      invited: parsed.invited || [],
    }
  } catch {
    return structuredClone(empty)
  }
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch (e) {
    // Most likely the quota — surface it so the tester knows why a photo didn't stick.
    console.warn('Weekly: could not save (storage full?)', e)
  }
}

export function resetAll() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}

export const uid = () => Math.random().toString(36).slice(2, 10)
