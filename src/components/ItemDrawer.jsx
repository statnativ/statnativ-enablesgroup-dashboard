import { useEffect, useState } from 'react'

const STATUS_OPTIONS = {
  document: ['Pending', 'Received', 'Under Review', 'Accepted', 'Rejected / Resubmission Required', 'Not Applicable'],
  task: ['Pending', 'In Progress', 'Done'],
}

export default function ItemDrawer({ item, canEdit, onClose, onSave }) {
  const [status, setStatus] = useState(item.status)
  const [notes, setNotes] = useState(item.notes ?? item.description ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStatus(item.status)
    setNotes(item.notes ?? item.description ?? '')
  }, [item])

  const options = STATUS_OPTIONS[item.itemType] ?? STATUS_OPTIONS.task
  const notesField = item.itemType === 'document' ? 'notes' : 'description'

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({ status, [notesField]: notes })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-card" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3>{item.title}</h3>
          <button type="button" className="drawer-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="field">
          <label>Owner</label>
          <input value={item.owner ?? ''} disabled />
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!canEdit}>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>{item.itemType === 'document' ? 'Notes' : 'Description'}</label>
          <textarea value={notes ?? ''} onChange={(e) => setNotes(e.target.value)} disabled={!canEdit} />
        </div>

        {canEdit ? (
          <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Update'}
          </button>
        ) : (
          <p className="drawer-readonly-note">
            You have read-only access. Ask a Statnativ administrator to make changes to this item.
          </p>
        )}
      </div>
    </div>
  )
}
