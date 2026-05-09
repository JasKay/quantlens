export default function LoadingScreen() {
  const steps = [
    "Fetching 5 years of market data...",
    "Running correlation analysis...",
    "Computing Value at Risk...",
    "Simulating 1,000 Monte Carlo paths...",
    "Replaying historical crises...",
    "Optimizing efficient frontier...",
    "Decomposing factor risk...",
    "Generating AI report...",
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Portfolio</h2>
        <p className="text-gray-400">Running institutional-grade risk engines</p>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
