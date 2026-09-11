const STATUS_CLASS = {
  Pending: 'badge-neutral',
  Received: 'badge-info',
  'Under Review': 'badge-warning',
  Accepted: 'badge-success',
  'Rejected / Resubmission Required': 'badge-danger',
  'Not Applicable': 'badge-neutral',
  'In Progress': 'badge-warning',
  Done: 'badge-success',
  Open: 'badge-danger',
  Resolved: 'badge-success',
  completed: 'badge-success',
  in_progress: 'badge-warning',
  pending: 'badge-neutral',
}

const SEVERITY_CLASS = {
  Low: 'badge-neutral',
  Medium: 'badge-warning',
  High: 'badge-danger',
  Critical: 'badge-danger',
}

export default function StatusBadge({ value, kind = 'status' }) {
  const map = kind === 'severity' ? SEVERITY_CLASS : STATUS_CLASS
  const cls = map[value] ?? 'badge-neutral'
  const label = typeof value === 'string' ? value.replace(/_/g, ' ') : value
  return <span className={`badge ${cls}`}>{label}</span>
}
