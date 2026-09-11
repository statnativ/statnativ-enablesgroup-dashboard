import { useAsyncData } from '../hooks/useAsyncData'
import { getMilestones } from '../services/engagementService'
import MilestoneJourney from '../components/MilestoneJourney'
import StatusBadge from '../components/StatusBadge'

export default function Timeline() {
  const { data: milestones, loading } = useAsyncData(getMilestones, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Formation Journey</h1>
        <p className="page-subtitle">India entity establishment & capability build milestones.</p>
      </div>

      {loading ? (
        <p className="empty-state">Loading milestones…</p>
      ) : (
        <>
          <div className="journey-card" style={{ marginTop: 0 }}>
            <MilestoneJourney milestones={milestones} />
          </div>

          <div className="section-card">
            <h3>Milestone Detail</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Milestone</th>
                  <th style={{ width: '14%' }}>Owner</th>
                  <th style={{ width: '16%' }}>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td className="muted">{m.owner}</td>
                    <td>
                      <StatusBadge value={m.status} />
                    </td>
                    <td className="muted">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
