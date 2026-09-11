import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import * as seed from '../data/seedData'

// Data access layer for the enablesGROUP engagement.
//
// When Supabase env vars are not configured, everything resolves from local
// seed data (held in memory for the session) so the dashboard UI can be
// built and reviewed before Supabase/Cloudflare accounts exist. Once
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, every function below
// reads from and writes to the real tables (see supabase/schema.sql), and
// Row Level Security governs what each signed-in user can see and edit.

const ENGAGEMENT_ID = seed.engagement.id

// Demo-mode in-memory copies so edits made through the UI persist for the
// session (but reset on reload) when there's no real backend yet.
const demoState = {
  documents: seed.documents.map((d) => ({ ...d })),
  tasks: seed.tasks.map((t) => ({ ...t })),
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 150))
}

export async function getEngagementOverview() {
  if (!isSupabaseConfigured) {
    const progress = seed.calculateProgress(seed.milestones)
    return delay({
      client: seed.client,
      engagement: { ...seed.engagement, overall_progress: progress },
      counts: {
        documentsReceived: demoState.documents.filter((d) => d.status === 'Received' || d.status === 'Accepted').length,
        documentsTotal: demoState.documents.filter((d) => d.status !== 'Not Applicable').length,
        openActions: demoState.tasks.filter((t) => t.status !== 'Done').length,
        blockers: seed.risks.filter((r) => r.status === 'Open').length,
        milestonesDone: seed.milestones.filter((m) => m.status === 'completed').length,
        milestonesTotal: seed.milestones.length,
      },
    })
  }

  const { data: engagement, error } = await supabase
    .from('engagements')
    .select('*, clients(*)')
    .eq('id', ENGAGEMENT_ID)
    .single()
  if (error) throw error

  const [{ data: documents }, { data: tasks }, { data: risks }, { data: milestones }] = await Promise.all([
    supabase.from('documents').select('status').eq('engagement_id', ENGAGEMENT_ID),
    supabase.from('tasks').select('status').eq('engagement_id', ENGAGEMENT_ID),
    supabase.from('risks').select('status').eq('engagement_id', ENGAGEMENT_ID),
    supabase.from('milestones').select('status').eq('engagement_id', ENGAGEMENT_ID),
  ])

  return {
    client: engagement.clients,
    engagement,
    counts: {
      documentsReceived: (documents ?? []).filter((d) => ['Received', 'Accepted'].includes(d.status)).length,
      documentsTotal: (documents ?? []).filter((d) => d.status !== 'Not Applicable').length,
      openActions: (tasks ?? []).filter((t) => t.status !== 'Done').length,
      blockers: (risks ?? []).filter((r) => r.status === 'Open').length,
      milestonesDone: (milestones ?? []).filter((m) => m.status === 'completed').length,
      milestonesTotal: (milestones ?? []).length,
    },
  }
}

export async function getMilestones() {
  if (!isSupabaseConfigured) return delay(seed.milestones)
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
    .order('sequence', { ascending: true })
  if (error) throw error
  return data
}

export async function getDocuments() {
  if (!isSupabaseConfigured) return delay(demoState.documents)
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
    .order('category', { ascending: true })
  if (error) throw error
  return data
}

export async function getTasks() {
  if (!isSupabaseConfigured) return delay(demoState.tasks)
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
    .order('priority', { ascending: false })
  if (error) throw error
  return data
}

export async function getRisks() {
  if (!isSupabaseConfigured) return delay(seed.risks)
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
  if (error) throw error
  return data
}

export async function getUpdates() {
  if (!isSupabaseConfigured) return delay(seed.updates)
  const { data, error } = await supabase
    .from('updates')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
    .order('update_date', { ascending: false })
  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Writes — only ever called from UI gated on isAdmin. Row Level Security is
// the real enforcement boundary (see supabase/schema.sql); the UI gate just
// avoids showing controls a read-only user couldn't use anyway.
// ---------------------------------------------------------------------------

export async function updateDocument(id, fields) {
  if (!isSupabaseConfigured) {
    const doc = demoState.documents.find((d) => d.id === id)
    if (doc) Object.assign(doc, fields)
    return delay(doc)
  }
  const { data, error } = await supabase.from('documents').update(fields).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function updateTask(id, fields) {
  if (!isSupabaseConfigured) {
    const task = demoState.tasks.find((t) => t.id === id)
    if (task) Object.assign(task, fields)
    return delay(task)
  }
  const { data, error } = await supabase.from('tasks').update(fields).eq('id', id).select().single()
  if (error) throw error
  return data
}
