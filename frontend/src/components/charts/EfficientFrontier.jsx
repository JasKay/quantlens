import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function EfficientFrontier({ data }) {
  const ref = useRef()

  useEffect(() => {
    if (!data) return
    const el = ref.current
    d3.select(el).selectAll("*").remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const width  = el.offsetWidth - margin.left - margin.right
    const height = 320 - margin.top - margin.bottom

    const svg = d3.select(el)
      .append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const allVols = [...data.frontier.volatilities,
      data.current_portfolio.volatility,
      data.optimal_portfolio.volatility,
      data.min_vol_portfolio.volatility]

    const allRets = [...data.frontier.returns,
      data.current_portfolio.return,
      data.optimal_portfolio.return,
      data.min_vol_portfolio.return]

    const x = d3.scaleLinear()
      .domain([d3.min(allVols) * 0.9, d3.max(allVols) * 1.1])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([d3.min(allRets) * 0.9, d3.max(allRets) * 1.1])
      .range([height, 0])

    const colorScale = d3.scaleSequential()
      .domain([d3.min(data.frontier.sharpes), d3.max(data.frontier.sharpes)])
      .interpolator(d3.interpolateViridis)

    // Frontier dots
    data.frontier.volatilities.forEach((v, i) => {
      svg.append("circle")
        .attr("cx", x(v))
        .attr("cy", y(data.frontier.returns[i]))
        .attr("r", 2)
        .attr("fill", colorScale(data.frontier.sharpes[i]))
        .attr("opacity", 0.6)
    })

    // Special portfolios
    const specials = [
      { label: "You",     d: data.current_portfolio, color: "#f97316", r: 8 },
      { label: "Optimal", d: data.optimal_portfolio,  color: "#22c55e", r: 8 },
      { label: "Min Vol", d: data.min_vol_portfolio,  color: "#3b82f6", r: 8 },
    ]

    specials.forEach(({ label, d, color, r }) => {
      svg.append("circle")
        .attr("cx", x(d.volatility))
        .attr("cy", y(d.return))
        .attr("r", r)
        .attr("fill", color)
        .attr("stroke", "#111827")
        .attr("stroke-width", 2)

      svg.append("text")
        .attr("x", x(d.volatility) + 10)
        .attr("y", y(d.return) + 4)
        .attr("font-size", 11)
        .attr("fill", color)
        .text(label)
    })

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${(d * 100).toFixed(0)}%`))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").attr("fill", "#9ca3af").attr("font-size", 11))
      .call(g => g.selectAll(".tick line").remove())

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d * 100).toFixed(0)}%`))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").attr("fill", "#9ca3af").attr("font-size", 11))
      .call(g => g.selectAll(".tick line").remove())

    // Axis labels
    svg.append("text")
      .attr("x", width / 2).attr("y", height + 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280").attr("font-size", 11)
      .text("Volatility (Risk)")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2).attr("y", -38)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280").attr("font-size", 11)
      .text("Expected Return")

  }, [data])

  const { current_portfolio: cur, optimal_portfolio: opt } = data
  const sharpeImprovement = (((opt.sharpe - cur.sharpe) / cur.sharpe) * 100).toFixed(1)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm text-gray-400 mb-1">Efficient Frontier</h3>
      <p className="text-xs text-gray-600 mb-4">Each dot is a possible portfolio. Color = Sharpe ratio (yellow = best)</p>
      <div ref={ref} className="w-full" />

      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Your Sharpe", value: cur.sharpe.toFixed(2), color: "text-orange-400" },
          { label: "Optimal Sharpe", value: opt.sharpe.toFixed(2), color: "text-green-400" },
          { label: "Improvement", value: `+${sharpeImprovement}%`, color: "text-blue-400" },
        ].map((s, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-2 font-medium">Optimal Allocation</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(opt.weights).map(([ticker, weight]) => (
            weight > 0.01 && (
              <span key={ticker} className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">
                {ticker}: {(weight * 100).toFixed(1)}%
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
