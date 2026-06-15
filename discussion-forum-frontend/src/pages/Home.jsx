import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePosts } from '../hooks/usePosts'
import { getCategories } from '../api/categoriesApi'
import PostCard from '../components/PostCard'
import CategorySidebar from '../components/CategorySidebar'
import SemanticSearchBar from '../components/SemanticSearchBar'
import SkeletonLoader from '../components/SkeletonLoader'

export default function Home() {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('newest')
  const categoryId = searchParams.get('categoryId') || ''
  const { data, isLoading } = usePosts({ page, size: 10, categoryId: categoryId || undefined })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })
  const activeCategory = categories?.find((c) => String(c.id) === categoryId)

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <SemanticSearchBar />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">
            {activeCategory ? (
              <span>
                {activeCategory.name}
                <Link to="/" className="text-sm font-normal text-gray-500 hover:text-gray-300 ml-3">
                  Clear filter
                </Link>
              </span>
            ) : (
              'Recent Discussions'
            )}
          </h1>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#1e293b] text-gray-300 border border-[#475569] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {isLoading ? (
          <SkeletonLoader count={5} />
        ) : (
          <div className="space-y-4">
            {data?.content?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-[#1e293b] border border-[#475569] rounded-md text-gray-300 hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data?.last}
            className="px-4 py-2 bg-[#1e293b] border border-[#475569] rounded-md text-gray-300 hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="w-64 hidden lg:block">
        <CategorySidebar />
      </div>
    </div>
  )
}
