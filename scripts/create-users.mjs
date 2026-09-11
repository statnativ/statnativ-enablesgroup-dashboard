// One-time provisioning script for enablesGROUP dashboard users.
//
// You run this yourself, locally, after creating the Supabase project and
// applying supabase/schema.sql + supabase/seed.sql. It is never run by
// Claude — it needs your Supabase service-role key, which must never be
// pasted into chat or committed to git.
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   READ_ONLY_PASSWORD='Enable@123' \
//   ADMIN_PASSWORD='Admin@123' \
//   node scripts/create-users.mjs
//
// Or put those four vars in a git-ignored `.env.server.local` file
// (KEY=VALUE per line) in the project root and just run:
//   node scripts/create-users.mjs
//
// Security note: reusing one password across every read-only account,
// and a guessable password on the one edit-access account, means anyone
// who has it can act as anyone else and there's no per-user audit trail.
// Rotate every account to its own password via Supabase Auth as soon as
// you reasonably can (the dashboard's invite-email flow is the easiest
// way — see README.md).

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.server.local if present, without adding a dotenv dependency.
const envFile = path.join(__dirname, '..', '.env.server.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, READ_ONLY_PASSWORD, ADMIN_PASSWORD } = process.env

for (const [name, value] of Object.entries({ SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, READ_ONLY_PASSWORD, ADMIN_PASSWORD })) {
  if (!value) {
    console.error(`Missing required env var: ${name}`)
    process.exit(1)
  }
}

const CLIENT_ID = 'enablesme' // must already exist — see supabase/seed.sql

const READ_ONLY_USERS = [
  'tess.jarquio@enablesgroup.com',
  'sanjay.sridher@enablesgroup.com',
  'nishant.singh@statnativ.com',
  'himanshu.seth@statnativ.com',
  'divyanshu.yadav@statnativ.com',
  'rohitsharma2490@gmail.com',
]

const ADMIN_USER = 'amittiwari@statnativ.com'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  // This script only uses the Admin API and plain table writes — no realtime
  // channels — but supabase-js still initializes a RealtimeClient in the
  // constructor, which throws on Node < 22 without a WebSocket polyfill.
  realtime: { transport: ws },
})

async function ensureUser(email, password) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (!error) return data.user

  // Already exists — look it up instead of failing the whole run.
  if (error.message?.toLowerCase().includes('already') || error.status === 422) {
    const { data: list, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError
    const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (existing) {
      console.log(`  (already existed: ${email})`)
      return existing
    }
  }
  throw error
}

async function grantAccess(userId, role) {
  const { error } = await supabase
    .from('user_client_access')
    .upsert({ user_id: userId, client_id: CLIENT_ID, role }, { onConflict: 'user_id,client_id' })
  if (error) throw error
}

async function main() {
  console.log(`Provisioning access to client "${CLIENT_ID}"...\n`)

  console.log(`Admin (edit access): ${ADMIN_USER}`)
  const admin = await ensureUser(ADMIN_USER, ADMIN_PASSWORD)
  await grantAccess(admin.id, 'admin')
  console.log('  -> role: admin\n')

  for (const email of READ_ONLY_USERS) {
    console.log(`Read-only: ${email}`)
    const user = await ensureUser(email, READ_ONLY_PASSWORD)
    await grantAccess(user.id, 'client_viewer')
    console.log('  -> role: client_viewer\n')
  }

  console.log('Done. Every account above can sign in at /login.')
  console.log('Strongly recommended next step: have each person reset their')
  console.log('password via Supabase Auth (or send invite emails instead) so')
  console.log('no one keeps sharing a password with 6 other people.')
}

main().catch((err) => {
  console.error('Failed:', err.message ?? err)
  process.exit(1)
})
