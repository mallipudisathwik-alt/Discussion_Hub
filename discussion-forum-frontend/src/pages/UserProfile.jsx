import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/PostCard'
import SkeletonLoader from '../components/SkeletonLoader'

export default function UserProfile() {
  const { id } = useParams()
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => axiosInstance.get(`/api/users/${id}`).then((res) => res.data),
  })
  const { data: posts, isLoading: postsLoading } = usePosts({ userId: id })

  if (userLoading) return <SkeletonLoader count={3} />

  if (!user) return <div className="text-gray-400">User not found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{user.username}</h1>
            <p className="text-gray-400 text-sm mt-1">{user.bio || 'No bio yet'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-200 mb-4">Posts</h2>
      {postsLoading ? (
        <SkeletonLoader count={3} />
      ) : (
        <div className="space-y-4">
          {posts?.content?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
