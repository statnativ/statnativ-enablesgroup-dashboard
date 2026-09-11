// Generates supabase/seed.sql from src/data/seedData.js so the two never drift.
// Run with: node scripts/generate-seed-sql.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as seed from '../src/data/seedData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function sqlStr(v) {
  if (v === null || v === undefined) return 'null'
  return `'${String(v).replace(/'/g, "''")}'`
}

function insert(table, columns, rows) {
  if (rows.length === 0) return ''
  const values = rows
    .map((row) => `  (${columns.map((c) => sqlStr(row[c])).join(', ')})`)
    .join(',\n')
  return `insert into ${table} (${columns.join(', ')}) values\n${values}\non conflict (id) do nothing;\n`
}

let out = `-- Generated from src/data/seedData.js — do not edit by hand.
-- Run scripts/generate-seed-sql.mjs after changing seed data, then re-run this
-- file in the Supabase SQL editor against a project with supabase/schema.sql applied.

`

out += insert('clients', ['id', 'name', 'code', 'status'], [seed.client]) + '\n'
out += insert(
  'engagements',
  ['id', 'client_id', 'name', 'description', 'current_phase', 'overall_progress', 'start_date', 'target_date', 'status'],
  [{ ...seed.engagement, overall_progress: seed.calculateProgress(seed.milestones) }]
) + '\n'
out += insert(
  'milestones',
  ['id', 'engagement_id', 'title', 'description', 'sequence', 'weight', 'owner', 'status'],
  seed.milestones.map((m) => ({ ...m, engagement_id: seed.engagement.id }))
) + '\n'
out += insert(
  'documents',
  ['id', 'engagement_id', 'category', 'document_name', 'owner', 'status', 'received_date', 'reviewed_date', 'notes'],
  seed.documents
) + '\n'
out += insert(
  'tasks',
  ['id', 'engagement_id', 'title', 'description', 'owner', 'owner_type', 'due_date', 'priority', 'status'],
  seed.tasks
) + '\n'
out += insert(
  'risks',
  ['id', 'engagement_id', 'title', 'description', 'severity', 'owner', 'mitigation', 'status'],
  seed.risks
) + '\n'
out += insert(
  'updates',
  ['id', 'engagement_id', 'update_date', 'title', 'description', 'created_by'],
  seed.updates
) + '\n'

const outPath = path.join(__dirname, '..', 'supabase', 'seed.sql')
writeFileSync(outPath, out)
console.log('Wrote', outPath)
