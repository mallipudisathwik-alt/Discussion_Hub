import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SemanticSearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setTimeout(() => setIsSearching(false), 500)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Semantic search — ask anything about discussions..."
          className="w-full bg-[#1e293b] text-gray-200 border border-[#475569] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </form>
  )
}
