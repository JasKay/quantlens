import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import Landing from "./pages/Landing"
import Results from "./pages/Results"
import Auth from "./components/Auth"
import Dashboard from "./pages/Dashboard"

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCheckingAuth(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <Auth />
      </div>
    )
  }

  if (showDashboard && !results) {
    return (
      <Dashboard
        session={session}
        onNewAnalysis={() => setShowDashboard(false)}
        onViewResults={(data) => {
          setResults(data)
          setShowDashboard(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!results
        ? <Landing
            setResults={setResults}
            setLoading={setLoading}
            loading={loading}
            session={session}
            onDashboard={() => setShowDashboard(true)}
          />
        : <Results
            data={results}
            onReset={() => setResults(null)}
            session={session}
          />
      }
    </div>
  )
}
