import { useState, useEffect, useRef } from 'react'

const CAP = 200

export default function LetterSheet({ friend, onSend, onClose }) {
  const [body, setBody] = useState('')
  const ref = useRef(null)
  const first = friend.name.split(' ')[0]
  const remaining = CAP - body.length

  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 60)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const send = () => {
    const trimmed = body.trim()
    if (trimmed) onSend(trimmed)
  }

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-eyebrow">A letter for</div>
        <div className="sheet-to">{friend.name}</div>
        <div className="sheet-rule" />
        <textarea
          ref={ref}
          maxLength={CAP}
          value={body}
          placeholder={`Write to ${first}…`}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="sheet-foot">
          <div className="sheet-note">Arrives quietly with {first}'s next issue. No notification.</div>
          <div className="sheet-actions">
            <span className={`counter${remaining < 20 ? ' warn' : ''}`}>{remaining}</span>
            <button className="sheet-cancel" onClick={onClose}>Cancel</button>
            <button className="sheet-send" disabled={!body.trim()} onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
