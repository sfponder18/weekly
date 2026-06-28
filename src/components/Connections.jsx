import { useState } from 'react'
import InviteSheet from './InviteSheet.jsx'

const CAP = 150

function Avatar({ name }) {
  return <span className="conn-ava">{name.trim()[0]?.toUpperCase() || '·'}</span>
}

export default function Connections({ data, friends, moreConnections, incomingRequests, onRemove, onAccept, onDecline, onAddInvite, onCancelInvite }) {
  const [confirm, setConfirm] = useState(null) // connection pending removal
  const [inviting, setInviting] = useState(false)

  const { removedIds, acceptedIds, declinedIds, invited } = data
  const myName = data.profile.name?.trim()

  // Active circle = people who wrote this week + quiet connections + accepted requests, minus anyone removed.
  const active = [
    ...friends.filter((f) => !removedIds.includes(f.id)).map((f) => ({ id: f.id, name: f.name, wrote: true })),
    ...moreConnections.filter((c) => !removedIds.includes(c.id)).map((c) => ({ id: c.id, name: c.name, wrote: false })),
    ...incomingRequests.filter((r) => acceptedIds.includes(r.id) && !removedIds.includes(r.id)).map((r) => ({ id: r.id, name: r.name, wrote: false })),
  ]
  const count = active.length
  const requests = incomingRequests.filter((r) => !acceptedIds.includes(r.id) && !declinedIds.includes(r.id))

  return (
    <div className="panel">
      <div className="cap-card">
        <div className="cap-num"><strong>{count}</strong> <span>/ {CAP}</span></div>
        <div className="cap-sub">connections · {CAP - count} spots left</div>
      </div>
      <p className="panel-note">
        Only you can see this list. Connections are mutual — both people accept, and either can leave. 150 is the cap; when you're full, you make room by letting someone go.
      </p>

      <button className="btn" onClick={() => setInviting(true)}>Invite a reader</button>

      {requests.length > 0 && (
        <>
          <div className="list-label">Wants to connect</div>
          {requests.map((r) => (
            <div className="conn" key={r.id}>
              <Avatar name={r.name} />
              <div className="conn-main">
                <div className="conn-name">{r.name}</div>
                <div className="conn-sub">Sent you a request</div>
              </div>
              <div className="req-actions">
                <button className="req-yes" onClick={() => onAccept(r)}>Accept</button>
                <button className="req-no" onClick={() => onDecline(r)}>Decline</button>
              </div>
            </div>
          ))}
        </>
      )}

      {invited.length > 0 && (
        <>
          <div className="list-label">Invited · awaiting reply</div>
          {invited.map((o) => (
            <div className="conn" key={o.id}>
              <Avatar name={o.name} />
              <div className="conn-main">
                <div className="conn-name">{o.name}</div>
                <div className="conn-sub">Pending</div>
              </div>
              <button className="conn-x" onClick={() => onCancelInvite(o.id)}>Cancel</button>
            </div>
          ))}
        </>
      )}

      <div className="list-label">Your connections · {count}</div>
      {count === 0 && <div className="empty-hint">No connections yet.<br />Invite your first reader.</div>}
      {active.map((c) => (
        <button className="conn tappable" key={c.id} onClick={() => setConfirm(c)}>
          <Avatar name={c.name} />
          <div className="conn-main">
            <div className="conn-name">{c.name}</div>
            <div className="conn-sub">{c.wrote ? 'Wrote in this week' : 'Quiet this week'}</div>
          </div>
          <span className="conn-chev">›</span>
        </button>
      ))}

      {inviting && <InviteSheet onAdd={onAddInvite} onClose={() => setInviting(false)} count={count} cap={CAP} />}

      {confirm && (
        <div className="sheet-scrim" onClick={() => setConfirm(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-eyebrow">Remove connection</div>
            <div className="sheet-to">{confirm.name}</div>
            <div className="sheet-rule" />
            <p className="sheet-copy">
              You'll both stop appearing in each other's issues straight away.{' '}
              {myName ? (
                <>{confirm.name.split(' ')[0]} will simply see: <em>"{myName} is no longer a connection."</em></>
              ) : (
                <>{confirm.name.split(' ')[0]} will simply see that you're no longer a connection.</>
              )}{' '}
              No reason is shared. You can reconnect later.
            </p>
            <div className="sheet-foot">
              <div className="sheet-note" />
              <div className="sheet-actions">
                <button className="sheet-cancel" onClick={() => setConfirm(null)}>Cancel</button>
                <button className="sheet-send danger" onClick={() => { onRemove(confirm); setConfirm(null) }}>Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
