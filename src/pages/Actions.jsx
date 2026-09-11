import { useAsyncData } from '../hooks/useAsyncData'
import { getTasks } from '../services/engagementService'
import StatusBadge from '../components/StatusBadge'

export default function Actions() {
  const { data: tasks, loading } = useAsyncData(getTasks, [])

  const clientTasks = (tasks ?? []).filter((t) => t.owner_type === 'client')
  const statnativTasks = (tasks ?? []).filter((t) => t.owner_type === 'statnativ')

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Actions</h1>
        <p className="page-subtitle">Open items split by who owns the next step.</p>
      </div>

      {loading ? (
        <p className="empty-state">Loading actions…</p>
      ) : (
        <div className="two-col">
          <div className="section-card">
            <h3>Client Actions</h3>
            <TaskList tasks={clientTasks} />
          </div>
          <div className="section-card">
            <h3>Statnativ Actions</h3>
            <TaskList tasks={statnativTasks} />
          </div>
        </div>
      )}
    </div>
  )
}

function TaskList({ tasks }) {
  if (tasks.length === 0) return <p className="empty-state">No open items.</p>
  return (
    <div className="action-list">
      {tasks.map((t) => (
        <div className="action-item" key={t.id}>
          <div className="action-item-top">
            <span className="action-title">{t.title}</span>
            <StatusBadge value={t.status} />
          </div>
          <div className="action-meta">
            Owner: {t.owner}
            {t.due_date && ` · Due: ${t.due_date}`}
          </div>
        </div>
      ))}
    </div>
  )
}
