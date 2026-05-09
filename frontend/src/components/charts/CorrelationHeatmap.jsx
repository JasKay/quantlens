import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function CorrelationHeatmap({ data }) {
  const ref = useRef()
  const { matrix, tickers } = data

  useEffect(() => {
    if (!matrix || !tickers) return
    const el = ref.current
    d3.select(el).selectAll("*").remove()

    const size    = Math.min(el.offsetWidth, 400)
    const margin  = { top: 30, right: 10, bottom: 10, left: 50 }
    const width   = size - margin.left - margin.right
    const cellSize = width / tickers.length

    const svg = d3.select(el)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const colorScale = d3.scaleSequential()
      .domain([-1, 1])
      .interpolator(d3.interpolateRdYlGn)

    tickers.forEach((rowTicker, i) => {
      tickers.forEach((colTicker, j) => {
        const val = matrix[rowTicker]?.[colTicker] ?? 0

        svg.append("rect")
          .attr("x", j * cellSize)
          .attr("y", i * cellSize)
          .attr("width",  cellSize - 2)
          .attr("height", cellSize - 2)
          .attr("rx", 4)
          .attr("fill", colorScale(val))

        svg.append("text")
          .attr("x", j * cellSize + cellSize / 2)
          .attr("y", i * cellSize + cellSize / 2 + 4)
          .attr("text-anchor", "middle")
          .attr("font-size", 11)
          .attr("fill", Math.abs(val) > 0.5 ? "#000" : "#fff")
          .text(val.toFixed(2))
      })
    })

    // Row labels
    tickers.forEach((t, i) => {
      svg.append("text")
        .attr("x", -8)
        .attr("y", i * cellSize + cellSize / 2 + 4)
        .attr("text-anchor", "end")
        .attr("font-size", 11)
        .attr("fill", "#9ca3af")
        .text(t)
    })

    // Col labels
    tickers.forEach((t, j) => {
      svg.append("text")
        .attr("x", j * cellSize + cellSize / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", 11)
        .attr("fill", "#9ca3af")
        .text(t)
    })

  }, [matrix, tickers])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-gray-400">Correlation Matrix</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded bg-red-500 inline-block" /> Negative
          <span className="w-3 h-3 rounded bg-green-500 inline-block ml-2" /> Positive
        </div>
      </div>
      <div ref={ref} className="w-full" />
      {data.high_correlation_pairs?.length > 0 && (
        <div className="mt-4 space-y-1">
          {data.high_correlation_pairs.map((p, i) => (
            <div key={i} className="text-xs text-yellow-400 bg-yellow-400/10 rounded px-3 py-1">
              ⚠️ {p.pair[0]} & {p.pair[1]} are highly correlated ({(p.correlation * 100).toFixed(0)}%)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
