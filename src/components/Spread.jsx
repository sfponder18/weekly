// One person's page in the issue. Shared by the digest (read mode) and by the
// "preview my spread" overlay in compose mode (preview=true hides the letter CTA).

function Photos({ photos, onOpen }) {
  const shown = photos.slice(0, 3)
  const n = shown.length
  return (
    <div className={`photos n${n}`}>
      {shown.map((src, i) => (
        <button
          key={i}
          className="photo"
          style={{ backgroundImage: `url("${src}")` }}
          onClick={() => onOpen(src)}
          aria-label="View photo full screen"
        />
      ))}
    </div>
  )
}

export default function Spread({ friend, onOpenPhoto, onWrite, sent, preview = false }) {
  const { name, photos = [], description, letterToYou } = friend
  const first = (name || 'You').split(' ')[0]

  const cta = sent ? (
    <div className="letter-sent">Letter on its way — arrives with {first}'s next issue</div>
  ) : (
    <button className="write-letter" onClick={() => onWrite(friend)}>
      Write {first} a letter
    </button>
  )

  return (
    <article className="spread">
      <div className="spread-header">
        <div className="spread-byline">{preview ? 'Your week' : 'From'}</div>
        <div className="spread-name">{name || 'You'}</div>
        <div className="spread-name-flourish" />
      </div>

      {photos.length > 0 && <Photos photos={photos} onOpen={onOpenPhoto} />}

      {description && <p className="description dropcap">{description}</p>}

      {letterToYou ? (
        <div className="letters">
          <div className="letter-eyebrow">A letter for you</div>
          <p className="letter-body">{letterToYou}</p>
          <div className="letter-sig">— {first}</div>
          {!preview && cta}
        </div>
      ) : (
        !preview &&
        (sent ? (
          <div className="letter-sent standalone">
            Letter on its way — arrives with {first}'s next issue
          </div>
        ) : (
          <button className="write-letter standalone" onClick={() => onWrite(friend)}>
            Write {first} a letter
          </button>
        ))
      )}
    </article>
  )
}
