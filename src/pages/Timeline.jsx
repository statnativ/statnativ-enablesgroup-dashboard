import { useAsyncData } from '../hooks/useAsyncData'
import { getMilestones } from '../services/engagementService'
import MilestoneJourney from '../components/MilestoneJourney'

export default function Timeline() {
  const { data: milestones, loading } = useAsyncData(getMilestones, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Milestones</h1>
        <p className="page-subtitle">India entity establishment & capability build journey.</p>
      </div>

      <div className="section-card">
        {loading ? (
          <p className="empty-state">Loading milestones…</p>
        ) : (
          <MilestoneJourney milestones={milestones} />
        )}
      </div>
    </div>
  )
}
