import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAsyncData } from '../hooks/useAsyncData'
import {
  getDocuments,
  getEngagementOverview,
  getMilestones,
  getTasks,
  getUpdates,
  updateDocument,
  updateTask,
} from '../services/engagementService'
import ItemDrawer from '../components/ItemDrawer'
import MilestoneJourney from '../components/MilestoneJourney'

const TABS = ['Formation Steps', 'Documents', 'Tasks & Actions', 'Awaiting Your Action', 'Completed']

const COMPLETE_STATUSES = ['Accepted', 'Received', 'Done']

function badgeClass(status) {
  if (COMPLETE_STATUSES.includes(status)) return 'badge-green'
  if (status === 'Pending') return 'badge-amber'
  if (status === 'In Progress') return 'badge-blue'
  if (status === 'Not Applicable') return 'badge-neutral'
  return 'badge-red' // Rejected / Resubmission Required, Open, etc.
}

export default function Overview() {
  const { isAdmin } = useAuth()
  const { data: overview, loading: loadingOverview } = useAsyncData(getEngagementOverview, [])
  const { data: milestones, loading: loadingMilestones } = useAsyncData(getMilestones, [])
  const { data: documents, loading: loadingDocuments, error: documentsError } = useAsyncData(getDocuments, [])
  const { data: tasks, loading: loadingTasks } = useAsyncData(getTasks, [])
  const { data: updates } = useAsyncData(getUpdates, [])

  const [activeTab, setActiveTab] = useState(TABS[0])
  const [activeItem, setActiveItem] = useState(null)
  const [localDocs, setLocalDocs] = useState(null)
  const [localTasks, setLocalTasks] = useState(null)

  const docs = localDocs ?? documents ?? []
  const taskList = localTasks ?? tasks ?? []

  if (loadingOverview || !overview) {
    return (
      <div className="page">
        <p className="empty-state">Loading engagement overview…</p>
      </div>
    )
  }

  const { engagement, counts } = overview
  const progress = engagement.overall_progress

  const items = [
    ...docs.map((d, i) => ({
      id: `doc-${d.id}`,
      rawId: d.id,
      num: `D${i + 1}`,
      title: d.document_name,
      sub: d.category,
      itemType: 'document',
      owner: d.owner,
      status: d.status,
      due: d.received_date ?? '—',
      notes: d.notes,
    })),
    ...taskList.map((t, i) => ({
      id: `task-${t.id}`,
      rawId: t.id,
      num: `T${i + 1}`,
      title: t.title,
      sub: t.owner_type === 'client' ? 'Client action' : 'Statnativ action',
      itemType: 'task',
      owner: t.owner,
      status: t.status,
      due: t.due_date ?? '—',
      description: t.description,
    })),
  ]

  const filtered = items.filter((it) => {
    if (activeTab === 'Documents') return it.itemType === 'document'
    if (activeTab === 'Tasks & Actions') return it.itemType === 'task'
    if (activeTab === 'Awaiting Your Action') return it.itemType === 'task' && it.status !== 'Done' && it.owner_type !== 'statnativ'
    if (activeTab === 'Completed') return COMPLETE_STATUSES.includes(it.status)
    return true // Formation Steps = all
  })

  const clientActions = taskList.filter((t) => t.owner_type === 'client' && t.status !== 'Done')

  async function handleSaveItem(fields) {
    if (activeItem.itemType === 'document') {
      const updated = await updateDocument(activeItem.rawId, fields)
      setLocalDocs((prev) => (prev ?? documents).map((d) => (d.id === activeItem.rawId ? { ...d, ...updated } : d)))
    } else {
      const updated = await updateTask(activeItem.rawId, fields)
      setLocalTasks((prev) => (prev ?? tasks).map((t) => (t.id === activeItem.rawId ? { ...t, ...updated } : t)))
    }
    setActiveItem(null)
  }

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h2>Welcome, enablesGROUP</h2>
          <p>Track the progress of your India subsidiary setup — all in one place.</p>
        </div>
        <div className="hero-right">
          <div className="quote">
            "Transparent journey. Faster outcomes. Stronger together."
            <b>— Statnativ</b>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-ring-row">
            <div
              className="kpi-ring"
              style={{ background: `conic-gradient(var(--green) 0 ${progress}%, #dfe8ee ${progress}% 100%)` }}
            >
              <span>{progress}%</span>
            </div>
            <div>
              <div className="kpi-label">Overall Progress</div>
              <div className="kpi-value">
                {counts.milestonesDone} of {counts.milestonesTotal} milestones
              </div>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Current Phase</div>
          <div className="kpi-value">{engagement.current_phase}</div>
          <div className="kpi-sub">{engagement.status === 'active' ? 'Active engagement' : engagement.status}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Next Milestone</div>
          <div className="kpi-value">
            {loadingMilestones ? '…' : milestones.find((m) => m.status !== 'completed')?.title ?? '—'}
          </div>
          <div className="kpi-sub">Owner: {loadingMilestones ? '…' : milestones.find((m) => m.status !== 'completed')?.owner ?? '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Documents</div>
          <div className="kpi-value">
            {counts.documentsReceived} / {counts.documentsTotal}
          </div>
          <div className="kpi-sub">received or accepted</div>
        </div>
      </section>

      <section className="journey-card">
        {loadingMilestones ? (
          <p className="empty-state">Loading journey…</p>
        ) : (
          <MilestoneJourney milestones={milestones} />
        )}
      </section>

      <section className="layout-grid">
        <div className="panel">
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="section-title">
            <div>
              <h4>{activeTab}</h4>
              <div className="section-title-sub">Click a row to view details{isAdmin ? ' and update status' : ''}.</div>
            </div>
            <div className="section-title-sub">{filtered.length} items</div>
          </div>
          <div className="items-table-wrap">
            {loadingDocuments || loadingTasks ? (
              <p className="empty-state" style={{ padding: '0 16px 16px' }}>
                Loading items…
              </p>
            ) : documentsError ? (
              <p className="empty-state" style={{ padding: '0 16px 16px' }}>
                Couldn't load documents.
              </p>
            ) : filtered.length === 0 ? (
              <p className="empty-state" style={{ padding: '0 16px 16px' }}>
                Nothing here.
              </p>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it) => (
                    <tr key={it.id} className="clickable" onClick={() => setActiveItem(it)}>
                      <td>{it.num}</td>
                      <td>
                        <div className="item-cell">
                          <div className="file-icon">{it.itemType === 'document' ? '▤' : '✓'}</div>
                          <div>
                            <strong>{it.title}</strong>
                            <span>{it.sub}</span>
                          </div>
                        </div>
                      </td>
                      <td>{it.itemType === 'document' ? 'Document' : 'Task'}</td>
                      <td>{it.owner}</td>
                      <td>
                        <span className={`badge ${badgeClass(it.status)}`}>{it.status}</span>
                      </td>
                      <td>
                        <button type="button" className="row-action" onClick={(e) => { e.stopPropagation(); setActiveItem(it) }}>
                          {isAdmin ? 'Update' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="side-stack">
          <div className="panel">
            <div className="panel-head">
              <h3>Client Actions</h3>
              {clientActions.length > 0 && <span className="badge-num">{clientActions.length}</span>}
            </div>
            <div className="list">
              {clientActions.length === 0 ? (
                <p className="empty-state">Nothing outstanding.</p>
              ) : (
                clientActions.map((t) => (
                  <div className="list-item alert-row" key={t.id}>
                    <span style={{ color: 'var(--red)' }}>▤</span>
                    <div>
                      <strong>{t.title}</strong>
                      <small>{t.due_date ? `Due ${t.due_date}` : 'No due date set'}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Recent Activity</h3>
            </div>
            <div className="list">
              {(updates ?? []).map((u) => (
                <div className="list-item" key={u.id}>
                  <strong>
                    <span style={{ color: 'var(--green)' }}>●</span> {u.title}
                  </strong>
                  <small>
                    {new Date(u.update_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Key Contacts</h3>
            </div>
            <div className="list">
              <div className="contact">
                <div className="cavatar">SS</div>
                <div>
                  <strong>Sanjay Sridher</strong>
                  <small>Client Executive</small>
                  <small>sanjay.sridher@enablesgroup.com</small>
                </div>
              </div>
              <div className="contact">
                <div className="cavatar">TJ</div>
                <div>
                  <strong>Tess Jarquio</strong>
                  <small>Financial Controller</small>
                  <small>tess.jarquio@enablesgroup.com</small>
                </div>
              </div>
              <div className="contact">
                <div className="cavatar">AT</div>
                <div>
                  <strong>Amit Tiwari</strong>
                  <small>Engagement Lead — Statnativ</small>
                  <small>amittiwari@statnativ.com</small>
                </div>
              </div>
            </div>
            <div className="note-box">💡 Need to share a document or ask a question? Use the Actions panel or contact the Statnativ team.</div>
          </div>
        </div>
      </section>

      {activeItem && (
        <ItemDrawer item={activeItem} canEdit={isAdmin} onClose={() => setActiveItem(null)} onSave={handleSaveItem} />
      )}
    </div>
  )
}
