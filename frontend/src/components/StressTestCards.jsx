export default function StressTestCards({ data }) {
  const crises = Object.values(data).filter(c => !c.error)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {crises.map((crisis, i) => {
        const drawdown = (crisis.max_drawdown * 100).toFixed(1)
        const totalReturn = (crisis.total_return * 100).toFixed(1)
        const isNeg = crisis.total_return < 0

        return (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-1">{crisis.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{crisis.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Return</p>
                <p className={`text-xl font-bold ${isNeg ? "text-red-400" : "text-green-400"}`}>
                  {totalReturn}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
                <p className="text-xl font-bold text-red-400">{drawdown}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-medium text-gray-300">{crisis.duration_days} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Period</p>
                <p className="text-sm font-medium text-gray-300">
                  {crisis.start?.slice(0, 7)} – {crisis.end?.slice(0, 7)}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gray-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${Math.min(Math.abs(drawdown), 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
