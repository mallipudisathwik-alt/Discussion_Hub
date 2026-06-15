import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categoriesApi'
import { formatDistanceToNow } from '../utils'

export default function PostCard({ post }) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })
  const categoryName = categories?.find((c) => c.id === post.categoryId)?.name || post.categoryId || 'General'

  return (
    <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-5 hover:border-blue-500/50 transition">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[48px]">
          <button className="text-gray-400 hover:text-blue-500 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-300">{post.upvotes - post.downvotes}</span>
          <button className="text-gray-400 hover:text-red-500 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
            {post.privatePost && <span className="text-yellow-500 text-xs">Private</span>}
            {post.isPinned && <span className="text-yellow-500 text-xs">Pinned</span>}
            {post.isClosed && <span className="text-red-500 text-xs">Closed</span>}
          </div>

          <Link to={`/posts/${post.id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-100 hover:text-blue-400 transition truncate">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>by {post.username || `User ${post.userId}`}</span>
            <span>{formatDistanceToNow(post.createdAt)}</span>
            <span>{post.viewCount} views</span>
          </div>
        </div>
      </div>
    </div>
  )
}
