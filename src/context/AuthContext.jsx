import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const DEMO_STORAGE_KEY = 'enablesgroup-dashboard-demo-session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = window.sessionStorage.getItem(DEMO_STORAGE_KEY)
      if (stored) setSession(JSON.parse(stored))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      session,
      loading,
      isDemo: !isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured) {
          const demoSession = { user: { email } }
          window.sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession))
          setSession(demoSession)
          return { error: null }
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) setSession(data.session)
        return { error }
      },
      async signOut() {
        if (!isSupabaseConfigured) {
          window.sessionStorage.removeItem(DEMO_STORAGE_KEY)
          setSession(null)
          return
        }
        await supabase.auth.signOut()
        setSession(null)
      },
    }),
    [session, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
