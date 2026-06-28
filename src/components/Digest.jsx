import Spread from './Spread.jsx'
import { issue } from '../seed.js'

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
  'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen', 'Twenty']
const word = (n) => WORDS[n] || String(n)
const pad = (n) => String(n).padStart(2, '0')

// Honest sparseness: the framing changes with how full the week is, never faked.
function temper(count) {
  if (count >= 5) return 'A full issue.'
  if (count >= 2) return 'A quiet, good issue.'
  if (count === 1) return "Just one this week — but it's here."
  return 'A still week.'
}

export default function Digest({ friends, sentTo, onOpenPhoto, onWrite }) {
  const count = friends.length
  const tocVisible = friends.slice(0, 5)
  const remaining = count - tocVisible.length

  return (
    <div className="page reveal">
      <header className="masthead">
        <div className="masthead-meta-top">
          <span>Vol. {issue.volume}</span>
          <span>{issue.date}</span>
        </div>
        <h1>Weekly</h1>
        <div className="masthead-tagline">a periodical of your people</div>
        <div className="masthead-meta-bottom">
          <span>No. {issue.number}</span>
          <span className="dot" />
          <span>{word(count)} {count === 1 ? 'Spread' : 'Spreads'}</span>
        </div>
      </header>

      <section className="intro">
        <div className="intro-eyebrow">Editor's note</div>
        <p className="intro-text">
          {word(count)} of your people wrote in this week. <em>{temper(count)}</em>
        </p>
      </section>

      <section className="toc">
        <div className="section-label">In this issue</div>
        <ul className="toc-list">
          {tocVisible.map((f, i) => (
            <li key={f.id}>
              <span className="name">{f.name}</span>
              <span className="dots" />
              <span className="pg">{pad(i + 1)}</span>
            </li>
          ))}
          {remaining > 0 && (
            <li className="muted">
              <span className="name">…and {remaining} more</span>
              <span className="dots" />
              <span className="pg">{pad(tocVisible.length + 1)}+</span>
            </li>
          )}
        </ul>
      </section>

      {friends.map((f) => (
        <Spread
          key={f.id}
          friend={f}
          sent={sentTo.has(f.id)}
          onOpenPhoto={onOpenPhoto}
          onWrite={onWrite}
        />
      ))}

      <footer className="colophon">
        <div className="colophon-mark">W.</div>
        <div className="colophon-rule" />
        <div className="colophon-text">
          End of issue {issue.number}
          <br />
          Next issue · {issue.nextDate}
        </div>
      </footer>
    </div>
  )
}
