const STATUS_CLASS = {
  Pending: 'badge-amber',
  Received: 'badge-blue',
  'Under Review': 'badge-amber',
  Accepted: 'badge-green',
  'Rejected / Resubmission Required': 'badge-red',
  'Not Applicable': 'badge-neutral',
  'In Progress': 'badge-blue',
  Done: 'badge-green',
  Open: 'badge-red',
  Resolved: 'badge-green',
  completed: 'badge-green',
  in_progress: 'badge-blue',
  pending: 'badge-neutral',
}

const SEVERITY_CLASS = {
  Low: 'badge-neutral',
  Medium: 'badge-amber',
  High: 'badge-red',
  Critical: 'badge-red',
}

export default function StatusBadge({ value, kind = 'status' }) {
  const map = kind === 'severity' ? SEVERITY_CLASS : STATUS_CLASS
  const cls = map[value] ?? 'badge-neutral'
  const label = typeof value === 'string' ? value.replace(/_/g, ' ') : value
  return <span className={`badge ${cls}`}>{label}</span>
}
