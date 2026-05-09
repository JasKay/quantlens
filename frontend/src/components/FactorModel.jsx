export default function FactorModel({ data }) {
  const { alpha, beta_market, r_squared, risk_decomposition } = data

  const metrics = [
    {
      label: "Market Beta",
      value: beta_market.toFixed(2),
      desc: beta_market > 1
        ? "More volatile than the market"
        : "Less volatile than the market",
      color: beta_market > 1.2 ? "text-red-400" : "text-green-400"
    },
    {
      label: "Annualized Alpha",
      value: `${(alpha * 100).toFixed(2)}%`,
      desc: alpha > 0
        ? "Generating excess return above market"
        : "Underperforming the market on risk-adjusted basis",
      color: alpha > 0 ? "text-green-400" : "text-red-400"
    },
    {
      label: "R² (Market Explain.)",
      value: `${(r_squared * 100).toFixed(1)}%`,
      desc: "How much of your risk is just market risk",
      color: "text-blue-400"
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-2">{m.label}</p>
            <p className={`text-3xl font-bold mb-1 ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-400">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Risk Decomposition</h3>
        <div className="flex rounded-full overflow-hidden h-4 mb-3">
          <div
            className="bg-blue-500 h-4"
            style={{ width: `${risk_decomposition.systematic_pct}%` }}
          />
          <div
            className="bg-purple-500 h-4"
            style={{ width: `${risk_decomposition.idiosyncratic_pct}%` }}
          />
        </div>
        <div className="flex gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Market Risk: {risk_decomposition.systematic_pct}%
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            Stock-Specific Risk: {risk_decomposition.idiosyncratic_pct}%
          </div>
        </div>
      </div>
    </div>
  )
}
