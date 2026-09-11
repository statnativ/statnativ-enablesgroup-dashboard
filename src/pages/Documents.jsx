import { useAsyncData } from '../hooks/useAsyncData'
import { getDocuments } from '../services/engagementService'
import StatusBadge from '../components/StatusBadge'

export default function Documents() {
  const { data: documents, loading } = useAsyncData(getDocuments, [])

  const grouped = (documents ?? []).reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] ?? []
    acc[doc.category].push(doc)
    return acc
  }, {})

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Document Tracker</h1>
        <p className="page-subtitle">
          Status only — sensitive identity documents (passports, Aadhaar, PAN, bank
          statements, signatures) are never uploaded to this dashboard.
        </p>
      </div>

      <div className="section-card">
        {loading ? (
          <p className="empty-state">Loading documents…</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Document</th>
                <th style={{ width: '16%' }}>Owner</th>
                <th style={{ width: '16%' }}>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([category, docs]) => (
                <FragmentGroup key={category} category={category} docs={docs} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function FragmentGroup({ category, docs }) {
  return (
    <>
      <tr>
        <td colSpan={4} className="category-heading">
          {category}
        </td>
      </tr>
      {docs.map((doc) => (
        <tr key={doc.id}>
          <td>{doc.document_name}</td>
          <td className="muted">{doc.owner}</td>
          <td>
            <StatusBadge value={doc.status} />
          </td>
          <td className="muted">{doc.notes ?? '—'}</td>
        </tr>
      ))}
    </>
  )
}
