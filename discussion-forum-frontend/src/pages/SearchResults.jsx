import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '../hooks/useSearch'
import SkeletonLoader from '../components/SkeletonLoader'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data: results, isLoading } = useSearch(query)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Search Results</h1>
      <p className="text-gray-400 text-sm mb-6">Showing results for "{query}"</p>

      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : results?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No results found. Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results?.map((result) => (
            <Link
              key={result.post_id}
              to={`/posts/${result.post_id}`}
              className="block bg-[#1e293b] rounded-lg border border-[#475569] p-5 hover:border-blue-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                      {result.category}
                    </span>
                    <span className="text-gray-600 text-xs">Score: {result.score?.toFixed(3)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 hover:text-blue-400 transition">
                    {result.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{result.content_snippet}</p>
                  {result.tags?.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {result.tags.map((tag) => (
                        <span key={tag} className="bg-[#334155] text-gray-400 text-xs px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${result.score > 0.7 ? 'bg-green-500' : result.score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-500">{Math.round(result.score * 100)}% match</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
