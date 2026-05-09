import CorrelationHeatmap  from "../components/charts/CorrelationHeatmap"
import MonteCarloCone      from "../components/charts/MonteCarloCone"
import EfficientFrontier   from "../components/charts/EfficientFrontier"
import VaRChart            from "../components/charts/VaRChart"
import StressTestCards     from "../components/StressTestCards"
import FactorModel         from "../components/FactorModel"
import AIReport            from "../components/AIReport"

const Section = ({ title, subtitle, children }) => (
  <div className="mb-12">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
)

export default function Results({ data, onReset }) {
  const vol  = (data.correlation.portfolio_volatility_annual * 100).toFixed(1)
  const hhi  = data.correlation.concentration_hhi.toFixed(2)
  const beta = data.factor_model.beta_market.toFixed(2)

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Quant<span className="text-blue-500">Lens</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Risk Intelligence Report</p>
          </div>
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
          >
            ← New Analysis
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Annual Volatility", value: `${vol}%`, sub: "Portfolio risk level", color: parseFloat(vol) > 20 ? "text-red-400" : "text-green-400" },
            { label: "Market Beta",       value: beta,       sub: "Market sensitivity",   color: parseFloat(beta) > 1.2 ? "text-red-400" : "text-blue-400" },
            { label: "Concentration HHI", value: hhi,        sub: "Diversification score (lower = better)", color: parseFloat(hhi) > 0.3 ? "text-yellow-400" : "text-green-400" },
          ].map((c, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">{c.label}</p>
              <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-600 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        <Section title="Correlation & Concentration" subtitle="How your assets move relative to each other">
          <CorrelationHeatmap data={data.correlation} />
        </Section>

        <Section title="Value at Risk" subtitle="Maximum expected loss at 95% confidence">
          <VaRChart data={data.var} />
        </Section>

        <Section title="Monte Carlo Simulation" subtitle="1,000 simulated portfolio paths over 5 years">
          <MonteCarloCone data={data.monte_carlo} />
        </Section>

        <Section title="Historical Stress Tests" subtitle="How your portfolio would have performed in real crises">
          <StressTestCards data={data.stress_tests} />
        </Section>

        <Section title="Efficient Frontier" subtitle="Are you optimally allocated for your level of risk?">
          <EfficientFrontier data={data.efficient_frontier} />
        </Section>

        <Section title="Factor Risk Decomposition" subtitle="What's actually driving your portfolio's risk">
          <FactorModel data={data.factor_model} />
        </Section>

        <Section title="AI Risk Intelligence Report" subtitle="Plain English interpretation of all the analysis above">
          <AIReport data={data.ai_report} />
        </Section>

      </div>
    </div>
  )
}
