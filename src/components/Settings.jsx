const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Settings({ data, onProfile, onReset }) {
  const p = data.profile
  const day = p.deliveryDay ?? 0
  const tz = p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
  const hasWeek = (data.draft.photos?.length || 0) > 0 || (data.draft.description || '').trim().length > 0

  return (
    <div className="panel">
      <div className="list-label">Display name</div>
      <input
        className="name-input"
        value={p.name}
        placeholder="your name"
        onChange={(e) => onProfile({ name: e.target.value })}
        aria-label="Display name"
      />
      <p className="panel-note">Shown on your spread and signed on the letters you write.</p>

      <div className="list-label">Delivery day</div>
      <div className="day-row">
        {DAYS.map((d, i) => (
          <button key={i} className={`day-chip${day === i ? ' on' : ''}`} onClick={() => onProfile({ deliveryDay: i })}>
            {d}
          </button>
        ))}
      </div>
      <p className="panel-note">Your issue arrives every {DAYS_FULL[day]}. Your week locks at the start of that day.</p>

      <div className="list-label">Time zone</div>
      <div className="set-static">{tz} <span className="tag">auto-detected</span></div>

      <div className="list-label">Find your people</div>
      <input
        className="name-input"
        value={p.phone}
        placeholder="phone number"
        inputMode="tel"
        onChange={(e) => onProfile({ phone: e.target.value })}
        aria-label="Phone number"
      />
      <p className="panel-note">
        Hashed on your device before it's ever sent — used only to match people who already have your number. Never uploaded in the clear.
      </p>

      <div className="list-label">Notifications</div>
      <div className="set-row">
        <div>
          <div className="set-name">Your issue is ready</div>
          <div className="set-sub">On your delivery day</div>
        </div>
        <span className="tag fixed">Always</span>
      </div>
      <div className="set-row">
        <div>
          <div className="set-name">New connection</div>
          <div className="set-sub">When someone accepts or invites you</div>
        </div>
        <span className="tag fixed">Always</span>
      </div>
      <div className="set-row">
        <div>
          <div className="set-name">Saturday reminder</div>
          <div className="set-sub">A single nudge if your week is still empty</div>
        </div>
        <button
          className={`toggle${p.remindersOn ? ' on' : ''}`}
          onClick={() => onProfile({ remindersOn: !p.remindersOn })}
          aria-label="Toggle Saturday reminder"
          aria-pressed={!!p.remindersOn}
        >
          <span />
        </button>
      </div>
      <p className="panel-note">These are the only notifications Weekly will ever send. No reactions, no re-engagement, no streaks.</p>

      <div className="list-label">Standing</div>
      <div className="set-static">{hasWeek ? 'In good standing' : 'Nothing in your week yet'}</div>
      <p className="panel-note">
        Submit at least once every four weeks to keep receiving issues. Miss it and delivery simply pauses — you're never removed from anyone's circle.
      </p>

      <div className="list-label">About</div>
      <ul className="ethos">
        <li>No likes, comments, or follower counts.</li>
        <li>No infinite scroll, no algorithmic ordering.</li>
        <li>No ads, no sponsored content, no selling your data.</li>
        <li>The only way in is an invite from someone you know.</li>
      </ul>

      <button className="reset-link danger" onClick={onReset}>Reset this demo</button>
      <div className="settings-foot">Weekly · prototype</div>
    </div>
  )
}
