import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Dashboard({ session, onNewAnalysis, onViewResults }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (!error) setAnalyses(data || [])
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Quant<span className="text-blue-500">Lens</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {session.user.email}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNewAnalysis}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              + New Analysis
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Past Analyses */}
        <h2 className="text-lg font-semibold text-white mb-4">Past Analyses</h2>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : analyses.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">No analyses yet</p>
            <button
              onClick={onNewAnalysis}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Run your first analysis
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => {
              const holdings = a.holdings || []
              const sharpe = a.results?.efficient_frontier?.current_portfolio?.sharpe
              const vol = a.results?.correlation?.portfolio_volatility_annual

              return (
                <div
                  key={a.id}
                  onClick={() => onViewResults(a.results)}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium mb-1">
                        {holdings.map(h => h.ticker).join(", ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(a.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex gap-4 text-right">
                      {sharpe && (
                        <div>
                          <p className="text-xs text-gray-500">Sharpe</p>
                          <p className="text-sm font-bold text-blue-400">{sharpe.toFixed(2)}</p>
                        </div>
                      )}
                      {vol && (
                        <div>
                          <p className="text-xs text-gray-500">Volatility</p>
                          <p className="text-sm font-bold text-orange-400">{(vol * 100).toFixed(1)}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
