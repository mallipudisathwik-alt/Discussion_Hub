import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePost, useUpvotePost, useDownvotePost, useDeletePost } from '../hooks/usePosts'
import { useComments } from '../hooks/useComments'
import { getCategories } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import VoteButton from '../components/VoteButton'
import CommentThread from '../components/CommentThread'
import SkeletonLoader from '../components/SkeletonLoader'
import { formatDistanceToNow } from '../utils'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: post, isLoading: postLoading } = usePost(id)
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useComments(id)
  const upvoteMutation = useUpvotePost()
  const downvoteMutation = useDownvotePost()
  const deletePostMutation = useDeletePost()

  if (postLoading) return <SkeletonLoader count={1} />

  if (!post) return <div className="text-gray-400">Post not found</div>

  const categoryName = categories?.find((c) => c.id === post.categoryId)?.name || post.categoryId || 'General'

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
        <div className="flex gap-4">
          <VoteButton
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            onUpvote={() => upvoteMutation.mutate(post.id)}
            onDownvote={() => downvoteMutation.mutate(post.id)}
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                {categoryName}
              </span>
              {post.privatePost && <span className="text-yellow-500 text-xs">Private</span>}
              {post.isPinned && <span className="text-yellow-500 text-xs">Pinned</span>}
              {post.isClosed && <span className="text-red-500 text-xs">Closed</span>}
            </div>

            <h1 className="text-2xl font-bold text-gray-100 mb-2">{post.title}</h1>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>by User {post.userId}</span>
              <span>{formatDistanceToNow(post.createdAt)}</span>
              <span>{post.viewCount} views</span>
              {user && (String(user.id) === String(post.userId) || user.role === 'ADMIN') && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this post?')) {
                      deletePostMutation.mutate(post.id, { onSuccess: () => navigate('/') })
                    }
                  }}
                  className="text-red-400 hover:text-red-300 ml-auto"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
              {post.content}
            </div>

            {post.tags?.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-[#334155] text-gray-300 text-xs px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      <CommentThread postId={id} comments={comments} isLoading={commentsLoading} error={commentsError} />
    </div>
  )
}
