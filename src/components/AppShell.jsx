import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/timeline', label: 'Milestones' },
  { to: '/dashboard/documents', label: 'Documents' },
  { to: '/dashboard/actions', label: 'Actions' },
  { to: '/dashboard/risks', label: 'Risks & Blockers' },
]

export default function AppShell() {
  const { session, isDemo, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Statnativ</div>
        <div className="sidebar-subbrand">enablesGROUP India Control Tower</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          Signed in as
          <br />
          <strong style={{ color: '#fff' }}>{session?.user?.email}</strong>
          <button type="button" className="sidebar-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="main-area">
        {isDemo && (
          <div className="demo-banner">
            Demo mode — Supabase is not configured, so this is showing local seed data
            and an unauthenticated demo session. Set VITE_SUPABASE_URL /
            VITE_SUPABASE_ANON_KEY to connect the real backend.
          </div>
        )}
        <Outlet />
      </div>
    </div>
  )
}
