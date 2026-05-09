import PortfolioInput from "../components/PortfolioInput"
import { analyzePortfolio } from "../api/analyze"
import LoadingScreen from "../components/LoadingScreen"

export default function Landing({ setResults, setLoading, loading }) {
  const handleSubmit = async (holdings) => {
    setLoading(true)
    try {
      const data = await analyzePortfolio(holdings)
      setResults(data)
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
