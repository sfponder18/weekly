import Connections from './Connections.jsx'
import Settings from './Settings.jsx'

// Full-screen account area. Not a content "mode" (the two-mode bar stays for
// reading/composing) — this is the surrounding shell: your people + settings.
export default function Account({
  panel, setPanel, onClose,
  data, friends, moreConnections, incomingRequests,
  onRemove, onAccept, onDecline, onAddInvite, onCancelInvite,
  onProfile, onReset,
}) {
  return (
    <div className="account">
      <header className="account-bar">
        <button className="account-back" onClick={onClose} aria-label="Back to the issue">←</button>
        <div className="seg">
          <button className={`seg-btn${panel === 'connections' ? ' on' : ''}`} onClick={() => setPanel('connections')}>
            Connections
          </button>
          <button className={`seg-btn${panel === 'settings' ? ' on' : ''}`} onClick={() => setPanel('settings')}>
            Settings
          </button>
        </div>
        <div className="account-spacer" />
      </header>

      <div className="account-body">
        {panel === 'connections' ? (
          <Connections
            data={data}
            friends={friends}
            moreConnections={moreConnections}
            incomingRequests={incomingRequests}
            onRemove={onRemove}
            onAccept={onAccept}
            onDecline={onDecline}
            onAddInvite={onAddInvite}
            onCancelInvite={onCancelInvite}
          />
        ) : (
          <Settings data={data} onProfile={onProfile} onReset={onReset} />
        )}
      </div>
    </div>
  )
}
