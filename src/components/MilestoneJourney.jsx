import StatusBadge from './StatusBadge'

const MARKER = { completed: '✓', in_progress: '●', pending: '○' }

export default function MilestoneJourney({ milestones }) {
  return (
    <div className="journey">
      {milestones.map((m) => (
        <div className="journey-item" key={m.id}>
          <div className="journey-marker-col">
            <div className={`journey-dot ${m.status}`}>{MARKER[m.status]}</div>
            <div className="journey-line" />
          </div>
          <div className="journey-body">
            <div className="journey-title-row">
              <span className="journey-title">{m.title}</span>
              <StatusBadge value={m.status} />
            </div>
            {m.description && <div className="journey-desc">{m.description}</div>}
            <div className="journey-owner">Owner: {m.owner}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
