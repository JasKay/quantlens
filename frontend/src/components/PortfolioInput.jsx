import { useState } from "react"

export default function PortfolioInput({ onSubmit, loading }) {
  const [holdings, setHoldings] = useState([
    { ticker: "AAPL", weight: 30 },
    { ticker: "NVDA", weight: 25 },
    { ticker: "TSLA", weight: 20 },
    { ticker: "BND",  weight: 15 },
    { ticker: "GLD",  weight: 10 },
  ])

  const total = holdings.reduce((s, h) => s + Number(h.weight), 0)

  const updateHolding = (i, field, value) => {
    const updated = [...holdings]
    updated[i][field] = value
    setHoldings(updated)
  }

  const addRow = () => setHoldings([...holdings, { ticker: "", weight: 0 }])

  const removeRow = (i) => setHoldings(holdings.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    if (Math.abs(total - 100) > 0.5) {
      alert(`Weights must sum to 100%. Currently: ${total}%`)
      return
    }
    const formatted = holdings.map(h => ({
      ticker: h.ticker.toUpperCase().trim(),
      weight: Number(h.weight) / 100
    }))
    onSubmit(formatted)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-4 space-y-2">
        {holdings.map((h, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white uppercase placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="TICKER"
              value={h.ticker}
              onChange={e => updateHolding(i, "ticker", e.target.value)}
            />
            <input
              className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              type="number"
              placeholder="%"
              value={h.weight}
              onChange={e => updateHolding(i, "weight", e.target.value)}
            />
            <span className="text-gray-500 text-sm w-4">%</span>
            <button
              onClick={() => removeRow(i)}
              className="text-gray-600 hover:text-red-400 text-lg leading-none"
            >×</button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={addRow}
          className="text-sm text-blue-400 hover:text-blue-300"
        >+ Add ticker</button>
        <span className={`text-sm font-medium ${Math.abs(total - 100) < 0.5 ? "text-green-400" : "text-red-400"}`}>
          Total: {total}%
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || Math.abs(total - 100) > 0.5}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200"
      >
        {loading ? "Analyzing..." : "Run Risk Analysis →"}
      </button>
    </div>
  )
}
