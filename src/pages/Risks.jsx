import { useAsyncData } from '../hooks/useAsyncData'
import { getRisks } from '../services/engagementService'
import StatusBadge from '../components/StatusBadge'

export default function Risks() {
  const { data: risks, loading } = useAsyncData(getRisks, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Risks & Blockers</h1>
        <p className="page-subtitle">Anything that could slow down the engagement.</p>
      </div>

      <div className="section-card">
        {loading ? (
          <p className="empty-state">Loading risks…</p>
        ) : (risks ?? []).length === 0 ? (
          <p className="empty-state">No open risks or blockers.</p>
        ) : (
          <div className="risk-list">
            {risks.map((r) => (
              <div className="risk-item" key={r.id}>
                <div className="risk-item-top">
                  <span className="risk-title">{r.title}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <StatusBadge value={r.severity} kind="severity" />
                    <StatusBadge value={r.status} />
                  </div>
                </div>
                <div className="risk-meta">Owner: {r.owner}</div>
                {r.description && <div className="risk-desc">{r.description}</div>}
                {r.mitigation && (
                  <>
                    <div className="risk-mitigation-label">Mitigation</div>
                    <div className="risk-mitigation">{r.mitigation}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
