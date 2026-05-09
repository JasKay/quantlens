import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function MonteCarloCone({ data }) {
  const ref = useRef()

  useEffect(() => {
    if (!data) return
    const el = ref.current
    d3.select(el).selectAll("*").remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const width  = el.offsetWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const svg = d3.select(el)
      .append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const n   = data.percentile_paths.p50.length
    const all = [
      ...data.percentile_paths.p5,
      ...data.percentile_paths.p95
    ]

    const x = d3.scaleLinear().domain([0, n]).range([0, width])
    const y = d3.scaleLinear().domain([d3.min(all) * 0.9, d3.max(all) * 1.05]).range([height, 0])

    // Shaded bands
    const bands = [
      { upper: "p95", lower: "p5",  fill: "#3b82f620" },
      { upper: "p75", lower: "p25", fill: "#3b82f640" },
    ]

    bands.forEach(({ upper, lower, fill }) => {
      const area = d3.area()
        .x((_, i) => x(i))
        .y0(d => y(data.percentile_paths[lower][d]))
        .y1(d => y(data.percentile_paths[upper][d]))

      svg.append("path")
        .datum(d3.range(n))
        .attr("fill", fill)
        .attr("d", area)
    })

    // Median line
    const line = d3.line()
      .x((_, i) => x(i))
      .y(d => y(d))

    svg.append("path")
      .datum(data.percentile_paths.p50)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line)

    // Baseline
    svg.append("line")
      .attr("x1", 0).attr("x2", width)
      .attr("y1", y(1)).attr("y2", y(1))
      .attr("stroke", "#6b7280")
      .attr("stroke-dasharray", "4,4")
      .attr("stroke-width", 1)

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `Day ${d}`))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").attr("fill", "#9ca3af").attr("font-size", 11))
      .call(g => g.selectAll(".tick line").remove())

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d.toFixed(1)}x`))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text").attr("fill", "#9ca3af").attr("font-size", 11))
      .call(g => g.selectAll(".tick line").remove())

  }, [data])

  const stats = data.final_value_stats

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm text-gray-400 mb-4">
        Monte Carlo Simulation — {data.n_simulations.toLocaleString()} paths over {data.years} years
      </h3>
      <div ref={ref} className="w-full" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { label: "Median Outcome", value: `${stats.median.toFixed(2)}x`, color: "text-blue-400" },
          { label: "Best Case (95th)", value: `${stats.p95.toFixed(2)}x`, color: "text-green-400" },
          { label: "Worst Case (5th)", value: `${stats.p5.toFixed(2)}x`, color: "text-red-400" },
          { label: "Prob. of Loss", value: `${(stats.prob_loss * 100).toFixed(1)}%`, color: "text-yellow-400" },
        ].map((s, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
