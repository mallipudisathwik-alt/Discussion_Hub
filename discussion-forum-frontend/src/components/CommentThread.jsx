import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAddComment, useReplyToComment, useUpvoteComment, useDeleteComment } from '../hooks/useComments'
import { formatDistanceToNow } from '../utils'

export default function CommentThread({ postId, comments, isLoading, error }) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const addComment = useAddComment()
  const replyMutation = useReplyToComment()
  const upvoteMutation = useUpvoteComment()
  const deleteMutation = useDeleteComment()

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    addComment.mutate({ postId, content: newComment }, {
      onSuccess: () => setNewComment('')
    })
  }

  const handleReply = (commentId) => {
    if (!replyText.trim()) return
    replyMutation.mutate({ commentId, content: replyText }, {
      onSuccess: () => {
        setReplyText('')
        setReplyTo(null)
      }
    })
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Comments ({comments?.length || 0})</h3>

      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-[#0f172a] border border-[#475569] rounded-md p-3 text-gray-200 focus:outline-none focus:border-blue-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={addComment.isPending}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addComment.isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
          Failed to load comments. Make sure the Node.js backend is running on port 3000.
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-400">Loading comments...</div>
      ) : (
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment._id} className="bg-[#1e293b] rounded-lg border border-[#475569] p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                  {comment.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <span className="text-gray-200 text-sm font-medium">{comment.username}</span>
                  <span className="text-gray-500 text-xs ml-2">{formatDistanceToNow(comment.created_at)}</span>
                  {comment.is_edited && <span className="text-gray-500 text-xs ml-1">(edited)</span>}
                </div>
              </div>
              {user && (user.id === comment.user_id || user.role === 'ADMIN') && (
                <button onClick={() => deleteMutation.mutate(comment._id)} className="text-gray-500 hover:text-red-400 text-xs">
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-300 text-sm">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => upvoteMutation.mutate(comment._id)} className="text-gray-500 hover:text-blue-500 text-xs flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {comment.upvotes}
              </button>
              {user && (
                <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)} className="text-gray-500 hover:text-blue-400 text-xs">
                  Reply
                </button>
              )}
            </div>

            {replyTo === comment._id && (
              <div className="mt-3 ml-6">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-[#0f172a] border border-[#475569] rounded-md p-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                  rows={2}
                />
                <button onClick={() => handleReply(comment._id)} className="mt-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                  Reply
                </button>
              </div>
            )}

            {comment.replies?.length > 0 && (
              <div className="ml-6 mt-3 space-y-3 border-l border-[#475569] pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="bg-[#0f172a] rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-200 text-sm font-medium">{reply.username}</span>
                      <span className="text-gray-500 text-xs">{formatDistanceToNow(reply.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
