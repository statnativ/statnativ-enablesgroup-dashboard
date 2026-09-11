import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/dashboard/timeline', label: 'Formation Journey', icon: '◉' },
  { to: '/dashboard/documents', label: 'Documents', icon: '▤' },
  { to: '/dashboard/actions', label: 'Tasks & Actions', icon: '✓' },
  { to: '/dashboard/risks', label: 'Risks & Blockers', icon: '⚑' },
]

function initials(email) {
  if (!email) return '—'
  const name = email.split('@')[0]
  const parts = name.split(/[._-]/).filter(Boolean)
  return (parts[0]?.[0] ?? '').toUpperCase() + (parts[1]?.[0] ?? parts[0]?.[1] ?? '').toUpperCase()
}

export default function AppShell() {
  const { session, isDemo, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <div className="mark">e</div>
            enableSME
          </div>
          <small>Part of enableGROUP</small>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <span className="sidebar-ico">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <strong>{session?.user?.email}</strong>
          <div style={{ marginTop: 2, opacity: 0.8 }}>{isAdmin ? 'Administrator (edit access)' : 'Read-only viewer'}</div>
          <button type="button" className="sidebar-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="main-area">
        {isDemo && (
          <div className="demo-banner">
            Demo mode — Supabase is not configured, so this is showing local seed data
            and an unauthenticated admin-preview session. Set VITE_SUPABASE_URL /
            VITE_SUPABASE_ANON_KEY to connect the real backend.
          </div>
        )}
        <header className="topbar">
          <div className="topbar-title">
            <h1>India Subsidiary Setup</h1>
            <p>Your Partner in a Successful India Setup</p>
          </div>
          <div className="topbar-right">
            <div className="avatar">{initials(session?.user?.email)}</div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
