import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import * as seed from '../data/seedData'

// Data access layer for the enablesGROUP engagement.
//
// When Supabase env vars are not configured, everything resolves from local
// seed data so the dashboard UI can be built and reviewed before Supabase/
// Cloudflare accounts exist. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// are set, every function below reads from the real tables (see
// supabase/schema.sql) and Row Level Security governs what each user can see.

const ENGAGEMENT_ID = seed.engagement.id

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
        documentsReceived: seed.documents.filter((d) => d.status === 'Received' || d.status === 'Accepted').length,
        documentsTotal: seed.documents.filter((d) => d.status !== 'Not Applicable').length,
        openActions: seed.tasks.filter((t) => t.status !== 'Done').length,
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
  if (!isSupabaseConfigured) return delay(seed.documents)
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('engagement_id', ENGAGEMENT_ID)
    .order('category', { ascending: true })
  if (error) throw error
  return data
}

export async function getTasks() {
  if (!isSupabaseConfigured) return delay(seed.tasks)
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
