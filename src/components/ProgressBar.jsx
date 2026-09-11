export default function ProgressBar({ percent, phase }) {
  return (
    <div className="progress-card">
      <div className="progress-top">
        <span className="progress-top-label">Overall Progress</span>
        <span className="progress-top-value">{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-meta">
        <span>
          Current phase: <strong>{phase}</strong>
        </span>
      </div>
    </div>
  )
}
