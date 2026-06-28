import { useRef, useState, useEffect } from 'react'
import { fileToThumb } from '../image.js'

const CAP = 280
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Time until the week locks — the start (00:00) of the chosen delivery day.
function timeToClose(now, deliveryDay) {
  const close = new Date(now)
  let diff = (deliveryDay - now.getDay() + 7) % 7
  if (diff === 0) diff = 7 // if today is delivery day, the week just delivered — count to next
  close.setDate(now.getDate() + diff)
  close.setHours(0, 0, 0, 0)
  const mins = Math.max(0, Math.floor((close - now) / 60000))
  const d = Math.floor(mins / 1440)
  const h = Math.floor((mins % 1440) / 60)
  const m = mins % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function Compose({ draft, profile, onDraft, onProfile, onPreview }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const photos = draft.photos || []
  const desc = draft.description || ''
  const remaining = CAP - desc.length
  const deliveryDay = profile.deliveryDay ?? 0

  async function onPick(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // let the same file be re-picked later
    if (!files.length) return
    setBusy(true)
    try {
      const room = 3 - photos.length
      const next = [...photos]
      for (const f of files.slice(0, room)) {
        try {
          next.push(await fileToThumb(f))
        } catch {
          /* skip files that can't be decoded */
        }
      }
      onDraft({ photos: next })
    } finally {
      setBusy(false)
    }
  }

  const remove = (i) => onDraft({ photos: photos.filter((_, j) => j !== i) })
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= photos.length) return
    const next = [...photos]
    ;[next[i], next[j]] = [next[j], next[i]]
    onDraft({ photos: next })
  }

  return (
    <div className="page reveal">
      <section className="compose-intro">
        <div className="intro-eyebrow">Your week</div>
        <p className="intro-text">
          This is your draft. Up to three photos and a few words. <em>It saves as you go.</em>
        </p>
      </section>

      <div className="field-label"><span>Signed</span></div>
      <input
        className="name-input"
        value={profile.name}
        placeholder="your name"
        onChange={(e) => onProfile({ name: e.target.value })}
        aria-label="Your name"
      />

      <div className="field-label">
        <span>Photos</span>
        <span className="counter">{photos.length}/3</span>
      </div>
      <div className="slots">
        {photos.map((src, i) => (
          <div key={i} className="slot" style={{ backgroundImage: `url("${src}")` }}>
            <span className="order">{i + 1}</span>
            <div className="slot-tools">
              <div className="grp">
                <button className="slot-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move earlier">‹</button>
                <button className="slot-btn" disabled={i === photos.length - 1} onClick={() => move(i, 1)} aria-label="Move later">›</button>
              </div>
              <button className="slot-btn" onClick={() => remove(i)} aria-label="Remove photo">×</button>
            </div>
          </div>
        ))}
        {photos.length < 3 && (
          <button className="slot empty" onClick={() => fileRef.current?.click()} disabled={busy}>
            <span className="plus">{busy ? '…' : '＋'}</span>
            <span className="lbl">{busy ? 'Adding' : 'Add photo'}</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPick} />

      <div className="field-label">
        <span>Your week, in a few words</span>
        <span className={`counter${remaining < 20 ? ' warn' : ''}`}>{remaining}</span>
      </div>
      <textarea
        className="desc-input"
        maxLength={CAP}
        value={desc}
        placeholder="What did this week hold?"
        onChange={(e) => onDraft({ description: e.target.value })}
        aria-label="Your week in a few words"
      />
      <div className="saved-note">Saved automatically · no submit button</div>

      <div className="closes">
        <div className="kicker">The week closes in</div>
        <div className="count">{timeToClose(now, deliveryDay)}</div>
        <div className="sub">Your {DAYS[deliveryDay]} issue locks and goes to print.</div>
      </div>

      <button className="btn" onClick={onPreview}>Preview my spread</button>
    </div>
  )
}
