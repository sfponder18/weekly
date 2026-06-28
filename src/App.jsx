import { useEffect, useState } from 'react'
import { friends as seedFriends, moreConnections, incomingRequests } from './seed.js'
import { load, save, resetAll, uid } from './store.js'
import Digest from './components/Digest.jsx'
import Compose from './components/Compose.jsx'
import Spread from './components/Spread.jsx'
import LetterSheet from './components/LetterSheet.jsx'
import PhotoViewer from './components/PhotoViewer.jsx'
import Account from './components/Account.jsx'

function PreviewOverlay({ data, onClose, onOpenPhoto }) {
  const { profile, draft } = data
  const has = (draft.photos?.length || 0) > 0 || (draft.description || '').trim().length > 0
  const me = {
    id: 'you',
    name: profile.name?.trim() || 'You',
    photos: draft.photos || [],
    description: draft.description || '',
  }
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="preview-caption">This is how your week will appear</div>
        {has ? (
          <Spread friend={me} preview onOpenPhoto={onOpenPhoto} />
        ) : (
          <div className="empty-hint">Nothing in your week yet.<br />Add a photo or a few words, then preview again.</div>
        )}
        <button className="btn ghost" onClick={onClose}>Close preview</button>
      </div>
    </div>
  )
}

function AccountButton({ name, onClick }) {
  const initial = name?.trim()?.[0]?.toUpperCase()
  return (
    <button className="account-btn" onClick={onClick} aria-label="Your people and settings">
      {initial ? (
        <span className="account-initial">{initial}</span>
      ) : (
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9.5" cy="8" r="3" />
          <path d="M4 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <path d="M16 5.2a3 3 0 0 1 0 5.6" opacity="0.55" />
          <path d="M17.6 14.2c2 .5 3.4 2.3 3.4 4.8" opacity="0.55" />
        </svg>
      )}
    </button>
  )
}

export default function App() {
  const [data, setData] = useState(load)
  const [mode, setMode] = useState('read')
  const [viewerSrc, setViewerSrc] = useState(null)
  const [writingTo, setWritingTo] = useState(null)
  const [previewing, setPreviewing] = useState(false)
  const [account, setAccount] = useState(null) // null | 'connections' | 'settings'
  const [toast, setToast] = useState(null)

  useEffect(() => { save(data) }, [data])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(t)
  }, [toast])

  const sentTo = new Set(data.sentLetters.map((l) => l.toId))
  // Removed connections drop out of your issue immediately.
  const activeFriends = seedFriends.filter((f) => !data.removedIds.includes(f.id))

  const updateDraft = (partial) => setData((d) => ({ ...d, draft: { ...d.draft, ...partial } }))
  const updateProfile = (partial) => setData((d) => ({ ...d, profile: { ...d.profile, ...partial } }))

  function sendLetter(body) {
    const to = writingTo
    setData((d) => ({
      ...d,
      sentLetters: [...d.sentLetters, { id: uid(), toId: to.id, toName: to.name, body, at: Date.now() }],
    }))
    setWritingTo(null)
    setToast(`Letter on its way — it arrives with ${to.name.split(' ')[0]}'s next issue.`)
  }

  function removeConnection(c) {
    setData((d) => ({
      ...d,
      removedIds: [...new Set([...d.removedIds, c.id])],
      acceptedIds: d.acceptedIds.filter((x) => x !== c.id),
      invited: d.invited.filter((i) => i.id !== c.id),
    }))
    setToast(`You and ${c.name.split(' ')[0]} are no longer connected.`)
  }

  function acceptRequest(r) {
    setData((d) => ({
      ...d,
      acceptedIds: [...new Set([...d.acceptedIds, r.id])],
      declinedIds: d.declinedIds.filter((x) => x !== r.id),
      removedIds: d.removedIds.filter((x) => x !== r.id),
    }))
    setToast(`You and ${r.name.split(' ')[0]} are now connected.`)
  }

  function declineRequest(r) {
    setData((d) => ({ ...d, declinedIds: [...new Set([...d.declinedIds, r.id])] }))
  }

  function addInvite(name) {
    const n = name.trim()
    if (!n) return
    setData((d) => ({ ...d, invited: [...d.invited, { id: uid(), name: n }] }))
    setToast(`Invite ready for ${n.split(' ')[0]}.`)
  }

  function cancelInvite(id) {
    setData((d) => ({ ...d, invited: d.invited.filter((i) => i.id !== id) }))
  }

  function reset() {
    const ok = window.confirm('Reset the demo? This clears your draft week, letters, and connection changes on this device.')
    if (!ok) return
    resetAll()
    setData(load())
    setAccount(null)
    setMode('read')
    setToast('Demo reset.')
  }

  return (
    <>
      {mode === 'read' ? (
        <Digest friends={activeFriends} sentTo={sentTo} onOpenPhoto={setViewerSrc} onWrite={setWritingTo} />
      ) : (
        <Compose
          draft={data.draft}
          profile={data.profile}
          onDraft={updateDraft}
          onProfile={updateProfile}
          onPreview={() => setPreviewing(true)}
        />
      )}

      {!account && <AccountButton name={data.profile.name} onClick={() => setAccount('connections')} />}

      <nav className="modebar">
        <button className={`tab${mode === 'read' ? ' active' : ''}`} onClick={() => setMode('read')}>
          <span className="glyph">W.</span>
          This week's issue
        </button>
        <div className="mark" />
        <button className={`tab${mode === 'compose' ? ' active' : ''}`} onClick={() => setMode('compose')}>
          <span className="glyph">✎</span>
          Your week
        </button>
      </nav>

      {account && (
        <Account
          panel={account}
          setPanel={setAccount}
          onClose={() => setAccount(null)}
          data={data}
          friends={seedFriends}
          moreConnections={moreConnections}
          incomingRequests={incomingRequests}
          onRemove={removeConnection}
          onAccept={acceptRequest}
          onDecline={declineRequest}
          onAddInvite={addInvite}
          onCancelInvite={cancelInvite}
          onProfile={updateProfile}
          onReset={reset}
        />
      )}

      {viewerSrc && <PhotoViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />}
      {writingTo && <LetterSheet friend={writingTo} onSend={sendLetter} onClose={() => setWritingTo(null)} />}
      {previewing && <PreviewOverlay data={data} onClose={() => setPreviewing(false)} onOpenPhoto={setViewerSrc} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
