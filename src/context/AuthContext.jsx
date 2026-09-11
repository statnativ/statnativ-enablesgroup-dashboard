import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { client as demoClient } from '../data/seedData'

const AuthContext = createContext(null)

const DEMO_STORAGE_KEY = 'enablesgroup-dashboard-demo-session'

// In demo mode there's no real backend to check a role against, so the demo
// session is treated as admin (full edit) so the UI can be previewed and
// reviewed end-to-end before Supabase is connected.
const DEMO_ROLE = 'admin'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadRole(currentSession) {
    if (!isSupabaseConfigured) {
      setRole(currentSession ? DEMO_ROLE : null)
      return
    }
    if (!currentSession) {
      setRole(null)
      return
    }
    const { data, error } = await supabase
      .from('user_client_access')
      .select('role')
      .eq('user_id', currentSession.user.id)
      .eq('client_id', demoClient.id)
      .maybeSingle()
    if (error) {
      console.error('Failed to load role', error)
      setRole('client_viewer')
      return
    }
    setRole(data?.role ?? 'client_viewer')
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = window.sessionStorage.getItem(DEMO_STORAGE_KEY)
      const initial = stored ? JSON.parse(stored) : null
      setSession(initial)
      loadRole(initial).finally(() => setLoading(false))
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadRole(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      await loadRole(newSession)
    })

    return () => listener.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(
    () => ({
      session,
      role,
      isAdmin: role === 'admin',
      loading,
      isDemo: !isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured) {
          const demoSession = { user: { email } }
          window.sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession))
          setSession(demoSession)
          await loadRole(demoSession)
          return { error: null }
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) {
          setSession(data.session)
          await loadRole(data.session)
        }
        return { error }
      },
      async signOut() {
        if (!isSupabaseConfigured) {
          window.sessionStorage.removeItem(DEMO_STORAGE_KEY)
          setSession(null)
          setRole(null)
          return
        }
        await supabase.auth.signOut()
        setSession(null)
        setRole(null)
      },
    }),
    [session, role, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
