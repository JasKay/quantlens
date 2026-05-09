import { useState } from "react"
import Landing from "./pages/Landing"
import Results from "./pages/Results"

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!results
        ? <Landing
            setResults={setResults}
            setLoading={setLoading}
            loading={loading}
          />
        : <Results
            data={results}
            onReset={() => setResults(null)}
          />
      }
    </div>
  )
}
