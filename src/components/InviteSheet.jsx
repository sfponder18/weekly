import { useState } from 'react'

// Mirrors the spec's invite-link mechanic. In the prototype the link is local
// and "add by name" creates a pending outgoing invite so the state is visible.
export default function InviteSheet({ onAdd, onClose, count, cap }) {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${location.origin}${location.pathname}?invite=${Math.random().toString(36).slice(2, 8)}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  }

  function add() {
    const n = name.trim()
    if (!n) return
    onAdd(n)
    onClose()
  }

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-eyebrow">Invite a reader</div>
        <div className="sheet-to">Add to your circle</div>
        <div className="sheet-rule" />
        <p className="sheet-copy">
          Share your invite link. When they accept, you become connections — and start appearing in each other's weekly issues.
        </p>
        <div className="invite-link">
          <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Invite link" />
          <button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <div className="invite-or">or add by name</div>
        <input
          className="name-input small"
          value={name}
          placeholder="their name"
          onChange={(e) => setName(e.target.value)}
          aria-label="Name to invite"
        />
        <div className="sheet-foot">
          <div className="sheet-note">{cap - count} of {cap} spots open.</div>
          <div className="sheet-actions">
            <button className="sheet-cancel" onClick={onClose}>Done</button>
            <button className="sheet-send" disabled={!name.trim()} onClick={add}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}
