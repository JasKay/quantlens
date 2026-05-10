import PortfolioInput from "../components/PortfolioInput"
import { analyzePortfolio } from "../api/analyze"
import LoadingScreen from "../components/LoadingScreen"
import { supabase } from "../lib/supabase"

export default function Landing({ setResults, setLoading, loading, session, onDashboard }) {
  const handleSubmit = async (holdings) => {
    console.log("Session:", session) 
    setLoading(true)
    try {
      const data = await analyzePortfolio(holdings)
      setResults(data)

      // Save analysis to Supabase if logged in
if (session) {
    // Make sure profile exists first
  await supabase.from("profiles").upsert({
    id: session.user.id,
    email: session.user.email,
  })

  // Then save the analysis
  const { error } = await supabase.from("analyses").insert({
    user_id: session.user.id,
    portfolio_name: holdings.map(h => h.ticker).join(", "),
    holdings: holdings,
    results: data
  })
  if (error) {
    console.error("Save error:", error.message)
  } else {
    console.log("Analysis saved successfully!")
  }
}

    } catch (err) {
      alert("Analysis failed. Make sure your backend is running.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">

      {/* Top nav */}
      {session && (
        <div className="fixed top-4 right-4">
          <button
            onClick={onDashboard}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
          >
            My Dashboard →
          </button>
        </div>
      )}

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-6">
          Institutional-Grade Portfolio Risk Analysis
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Quant<span className="text-blue-500">Lens</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
          Enter your portfolio and get a full risk intelligence report —
          Monte Carlo simulations, stress tests, efficient frontier optimization,
          and factor analysis. Instantly.
        </p>
      </div>

      <PortfolioInput onSubmit={handleSubmit} loading={loading} />

      <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-gray-600">
        {["Monte Carlo Simulation", "VaR Analysis", "Stress Testing",
          "Efficient Frontier", "Factor Decomposition", "AI Report"].map(f => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-500" />{f}
          </span>
        ))}
      </div>
    </div>
  )
}
