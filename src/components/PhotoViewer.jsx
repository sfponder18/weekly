import { useEffect } from 'react'

export default function PhotoViewer({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="viewer" onClick={onClose}>
      <button className="close" aria-label="Close">×</button>
      <img src={src} alt="" />
    </div>
  )
}
