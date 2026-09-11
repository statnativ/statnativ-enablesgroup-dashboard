export default function MilestoneJourney({ milestones }) {
  return (
    <div className="journey-steps">
      {milestones.map((m) => (
        <div className={`journey-step ${m.status}`} key={m.id}>
          <div className="journey-step-dot">{m.status === 'completed' ? '✓' : m.sequence}</div>
          <strong>{m.title}</strong>
          <small>{m.status === 'completed' ? 'Complete' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}</small>
        </div>
      ))}
    </div>
  )
}
