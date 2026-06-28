import { useEffect, useState } from 'react'
import { friends as seedFriends } from './seed.js'
import { load, save, resetAll, uid } from './store.js'
import Digest from './components/Digest.jsx'
import Compose from './components/Compose.jsx'
import Spread from './components/Spread.jsx'
import LetterSheet from './components/LetterSheet.jsx'
import PhotoViewer from './components/PhotoViewer.jsx'

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

export default function App() {
  const [data, setData] = useState(load)
  const [mode, setMode] = useState('read')
  const [viewerSrc, setViewerSrc] = useState(null)
  const [writingTo, setWritingTo] = useState(null)
  const [previewing, setPreviewing] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { save(data) }, [data])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(t)
  }, [toast])

  const sentTo = new Set(data.sentLetters.map((l) => l.toId))

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

  function reset() {
    const ok = window.confirm('Reset the demo? This clears your draft week and any letters you’ve written on this device.')
    if (!ok) return
    resetAll()
    setData(load())
    setMode('read')
    setToast('Demo reset.')
  }

  return (
    <>
      {mode === 'read' ? (
        <Digest friends={seedFriends} sentTo={sentTo} onOpenPhoto={setViewerSrc} onWrite={setWritingTo} />
      ) : (
        <Compose
          draft={data.draft}
          profile={data.profile}
          onDraft={updateDraft}
          onProfile={updateProfile}
          onPreview={() => setPreviewing(true)}
          onReset={reset}
        />
      )}

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

      {viewerSrc && <PhotoViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />}
      {writingTo && <LetterSheet friend={writingTo} onSend={sendLetter} onClose={() => setWritingTo(null)} />}
      {previewing && <PreviewOverlay data={data} onClose={() => setPreviewing(false)} onOpenPhoto={setViewerSrc} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
