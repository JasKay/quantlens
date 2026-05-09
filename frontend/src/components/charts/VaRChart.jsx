import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function VaRChart({ data }) {
  const chartData = [
    {
      name: "Historical",
      daily: Math.abs(data.historical.var_daily * 100),
      annual: Math.abs(data.historical.var_annual * 100),
    },
    {
      name: "Parametric",
      daily: Math.abs(data.parametric.var_daily * 100),
      annual: Math.abs(data.parametric.var_annual * 100),
    },
    {
      name: "Monte Carlo",
      daily: Math.abs(data.monte_carlo.var_daily * 100),
      annual: Math.abs(data.monte_carlo.var_annual * 100),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {chartData.map((d, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{d.name}</p>
            <p className="text-2xl font-bold text-red-400">-{d.daily.toFixed(2)}%</p>
            <p className="text-xs text-gray-500">daily VaR (95%)</p>
            <p className="text-sm text-gray-400 mt-1">-{d.annual.toFixed(1)}% annual</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm text-gray-400 mb-4">Annual VaR Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
              formatter={v => [`${v.toFixed(2)}%`, "Annual VaR"]}
            />
            <Bar dataKey="annual" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={["#ef4444", "#f97316", "#eab308"][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
