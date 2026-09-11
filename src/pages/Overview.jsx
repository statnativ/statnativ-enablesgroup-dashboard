import { Link } from 'react-router-dom'
import { useAsyncData } from '../hooks/useAsyncData'
import { getEngagementOverview, getMilestones, getTasks, getUpdates } from '../services/engagementService'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import MilestoneJourney from '../components/MilestoneJourney'
import StatusBadge from '../components/StatusBadge'

export default function Overview() {
  const { data: overview, loading: loadingOverview } = useAsyncData(getEngagementOverview, [])
  const { data: milestones, loading: loadingMilestones } = useAsyncData(getMilestones, [])
  const { data: tasks, loading: loadingTasks } = useAsyncData(getTasks, [])
  const { data: updates, loading: loadingUpdates } = useAsyncData(getUpdates, [])

  if (loadingOverview || !overview) {
    return (
      <div className="page">
        <p className="empty-state">Loading engagement overview…</p>
      </div>
    )
  }

  const { client, engagement, counts } = overview
  const openClientTasks = (tasks ?? []).filter((t) => t.owner_type === 'client' && t.status !== 'Done')
  const openStatnativTasks = (tasks ?? []).filter((t) => t.owner_type === 'statnativ' && t.status !== 'Done')

  return (
    <div className="page">
      <div className="page-header">
        <p className="page-subtitle" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
          {client.name}
        </p>
        <h1 className="page-title">{engagement.name}</h1>
      </div>

      <ProgressBar percent={engagement.overall_progress} phase={engagement.current_phase} />

      <div className="stat-grid">
        <StatCard label="Documents" value={`${counts.documentsReceived} / ${counts.documentsTotal}`} />
        <StatCard label="Open Actions" value={counts.openActions} />
        <StatCard label="Blockers" value={counts.blockers} />
        <StatCard label="Milestones" value={`${counts.milestonesDone} / ${counts.milestonesTotal}`} />
      </div>

      <div className="two-col">
        <div className="section-card">
          <h3>What's waiting on the client</h3>
          {loadingTasks ? (
            <p className="empty-state">Loading…</p>
          ) : openClientTasks.length === 0 ? (
            <p className="empty-state">Nothing outstanding on the client side right now.</p>
          ) : (
            <div className="action-list">
              {openClientTasks.map((t) => (
                <div className="action-item" key={t.id}>
                  <div className="action-item-top">
                    <span className="action-title">{t.title}</span>
                    <StatusBadge value={t.status} />
                  </div>
                  <div className="action-meta">Owner: {t.owner}</div>
                </div>
              ))}
            </div>
          )}
          <p style={{ marginTop: 14 }}>
            <Link to="/dashboard/actions" style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>
              View all actions →
            </Link>
          </p>
        </div>

        <div className="section-card">
          <h3>What Statnativ is working on</h3>
          {loadingTasks ? (
            <p className="empty-state">Loading…</p>
          ) : openStatnativTasks.length === 0 ? (
            <p className="empty-state">Nothing in progress right now.</p>
          ) : (
            <div className="action-list">
              {openStatnativTasks.map((t) => (
                <div className="action-item" key={t.id}>
                  <div className="action-item-top">
                    <span className="action-title">{t.title}</span>
                    <StatusBadge value={t.status} />
                  </div>
                  <div className="action-meta">Owner: {t.owner}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="two-col">
        <div className="section-card">
          <h3>Journey</h3>
          {loadingMilestones ? (
            <p className="empty-state">Loading…</p>
          ) : (
            <MilestoneJourney milestones={milestones} />
          )}
        </div>

        <div className="section-card">
          <h3>Recent Updates</h3>
          {loadingUpdates ? (
            <p className="empty-state">Loading…</p>
          ) : (
            <div className="update-list">
              {(updates ?? []).map((u) => (
                <div className="update-item" key={u.id}>
                  <div className="update-date">
                    {new Date(u.update_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="update-body">
                    <strong>{u.title}</strong>
                    {u.description && u.description !== u.title && <span>{u.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
