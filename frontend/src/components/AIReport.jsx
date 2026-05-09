export default function AIReport({ data }) {
  if (data?.error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-400 text-sm">
        AI report temporarily unavailable. All quantitative analysis above is complete.
      </div>
    )
  }

  const sections = data?.split(/\d\.\s+/).filter(Boolean) || []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      {sections.length > 0
        ? sections.map((section, i) => (
            <div key={i} className="text-sm text-gray-300 leading-relaxed border-b border-gray-800 pb-4 last:border-0 last:pb-0">
              {section}
            </div>
          ))
        : <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{data}</p>
      }
    </div>
  )
}
