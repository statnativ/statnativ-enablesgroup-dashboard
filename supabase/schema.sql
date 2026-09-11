-- Statnativ enablesGROUP client dashboard — schema + Row Level Security
--
-- Run this in the Supabase SQL editor for a project dedicated to this dashboard.
-- Mirrors the data model in Statnativ_enablesGROUP_Client_Dashboard_Deployment_Guide.md
-- section 9, and the authorization rule in section 10:
--   "An authenticated user can only access records belonging to a client for which
--    that user's ID has an active entry in user_client_access."
--
-- This file matches what is actually applied to the live "EnableGroup" Supabase
-- project as of the harden_rls_and_indexes migration (run via the Supabase MCP
-- connection) — policies split per-action instead of FOR ALL to avoid Postgres
-- evaluating redundant permissive policies on every SELECT, auth.uid() wrapped
-- in (select ...) so it's evaluated once per query rather than once per row,
-- helper-function EXECUTE restricted to the authenticated role, and covering
-- indexes added on every engagement_id / client_id foreign key.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists clients (
  id text primary key,
  name text not null,
  code text not null unique,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists engagements (
  id text primary key,
  client_id text not null references clients (id) on delete cascade,
  name text not null,
  description text,
  current_phase text,
  overall_progress int not null default 0,
  start_date date,
  target_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists milestones (
  id text primary key,
  engagement_id text not null references engagements (id) on delete cascade,
  title text not null,
  description text,
  sequence int not null,
  weight int not null default 0,
  owner text,
  planned_date date,
  completed_date date,
  status text not null default 'pending', -- pending | in_progress | completed
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists tasks (
  id text primary key,
  engagement_id text not null references engagements (id) on delete cascade,
  title text not null,
  description text,
  owner text,
  owner_type text not null, -- client | statnativ
  due_date date,
  priority text default 'medium', -- low | medium | high
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists documents (
  id text primary key,
  engagement_id text not null references engagements (id) on delete cascade,
  category text not null,
  document_name text not null,
  owner text,
  status text not null default 'Pending',
  received_date date,
  reviewed_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists risks (
  id text primary key,
  engagement_id text not null references engagements (id) on delete cascade,
  title text not null,
  description text,
  severity text not null default 'Medium', -- Low | Medium | High | Critical
  owner text,
  mitigation text,
  status text not null default 'Open', -- Open | Resolved
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists updates (
  id text primary key,
  engagement_id text not null references engagements (id) on delete cascade,
  update_date date not null default current_date,
  title text not null,
  description text,
  created_by text,
  created_at timestamptz not null default now()
);

-- Maps an authenticated Supabase user to a client and a role.
create table if not exists user_client_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null references clients (id) on delete cascade,
  role text not null default 'client_viewer', -- admin | client_contributor | client_viewer
  primary key (user_id, client_id)
);

-- ---------------------------------------------------------------------------
-- Indexes (covering the foreign keys above)
-- ---------------------------------------------------------------------------

create index if not exists idx_engagements_client_id on engagements (client_id);
create index if not exists idx_milestones_engagement_id on milestones (engagement_id);
create index if not exists idx_tasks_engagement_id on tasks (engagement_id);
create index if not exists idx_documents_engagement_id on documents (engagement_id);
create index if not exists idx_risks_engagement_id on risks (engagement_id);
create index if not exists idx_updates_engagement_id on updates (engagement_id);
create index if not exists idx_user_client_access_client_id on user_client_access (client_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table clients enable row level security;
alter table engagements enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table risks enable row level security;
alter table updates enable row level security;
alter table user_client_access enable row level security;

-- Helper: does the current user have any access row for a given client?
create or replace function has_client_access(target_client_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from user_client_access
    where user_id = auth.uid() and client_id = target_client_id
  );
$$;

-- Helper: is the current user an admin for a given client?
create or replace function is_client_admin(target_client_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from user_client_access
    where user_id = auth.uid() and client_id = target_client_id and role = 'admin'
  );
$$;

-- These are SECURITY DEFINER, so by default anon/authenticated can invoke
-- them directly via RPC (they only ever return a boolean, but there's no
-- reason to expose them beyond what RLS itself needs).
revoke execute on function has_client_access(text) from public, anon;
grant execute on function has_client_access(text) to authenticated;

revoke execute on function is_client_admin(text) from public, anon;
grant execute on function is_client_admin(text) to authenticated;

-- clients: readable if the user has an access row for it
create policy "clients readable by authorized users"
  on clients for select
  using (has_client_access(id));

-- engagements: readable if the user has access to the parent client
create policy "engagements readable by authorized users"
  on engagements for select
  using (has_client_access(client_id));

create policy "engagements writable by admins"
  on engagements for update
  using (is_client_admin(client_id));

-- Generic pattern for engagement-scoped tables: readable by anyone with access
-- to the parent engagement's client; writable only by admins. Client
-- contributors are intentionally read-only in V1 (see deployment guide section 15).
-- Insert/update/delete are split into separate policies (rather than FOR ALL)
-- so SELECT is governed by exactly one permissive policy, not two.
create policy "milestones readable" on milestones for select
  using (has_client_access((select client_id from engagements where id = engagement_id)));
create policy "milestones insert by admins" on milestones for insert
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "milestones update by admins" on milestones for update
  using (is_client_admin((select client_id from engagements where id = engagement_id)))
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "milestones delete by admins" on milestones for delete
  using (is_client_admin((select client_id from engagements where id = engagement_id)));

create policy "tasks readable" on tasks for select
  using (has_client_access((select client_id from engagements where id = engagement_id)));
create policy "tasks insert by admins" on tasks for insert
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "tasks update by admins" on tasks for update
  using (is_client_admin((select client_id from engagements where id = engagement_id)))
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "tasks delete by admins" on tasks for delete
  using (is_client_admin((select client_id from engagements where id = engagement_id)));

create policy "documents readable" on documents for select
  using (has_client_access((select client_id from engagements where id = engagement_id)));
create policy "documents insert by admins" on documents for insert
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "documents update by admins" on documents for update
  using (is_client_admin((select client_id from engagements where id = engagement_id)))
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "documents delete by admins" on documents for delete
  using (is_client_admin((select client_id from engagements where id = engagement_id)));

create policy "risks readable" on risks for select
  using (has_client_access((select client_id from engagements where id = engagement_id)));
create policy "risks insert by admins" on risks for insert
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "risks update by admins" on risks for update
  using (is_client_admin((select client_id from engagements where id = engagement_id)))
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "risks delete by admins" on risks for delete
  using (is_client_admin((select client_id from engagements where id = engagement_id)));

create policy "updates readable" on updates for select
  using (has_client_access((select client_id from engagements where id = engagement_id)));
create policy "updates insert by admins" on updates for insert
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "updates update by admins" on updates for update
  using (is_client_admin((select client_id from engagements where id = engagement_id)))
  with check (is_client_admin((select client_id from engagements where id = engagement_id)));
create policy "updates delete by admins" on updates for delete
  using (is_client_admin((select client_id from engagements where id = engagement_id)));

-- user_client_access: a user can see their own access rows; only admins manage them.
create policy "users can read their own access rows"
  on user_client_access for select
  using (user_id = (select auth.uid()));

create policy "admins insert access rows" on user_client_access for insert
  with check (is_client_admin(client_id));
create policy "admins update access rows" on user_client_access for update
  using (is_client_admin(client_id))
  with check (is_client_admin(client_id));
create policy "admins delete access rows" on user_client_access for delete
  using (is_client_admin(client_id));

-- Note: because the admin-only insert/update/delete policies above depend on
-- an existing admin row, the very first user_client_access row for a client
-- (its first admin) must be inserted from the Supabase SQL editor / table
-- editor (or via the service-role key server-side), not through the app
-- under RLS. Every subsequent grant can then be made by that admin through
-- the app.
