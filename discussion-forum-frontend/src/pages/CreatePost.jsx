import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categoriesApi'
import { useCreatePost } from '../hooks/usePosts'
import RichTextEditor from '../components/RichTextEditor'
import { useAuth } from '../context/AuthContext'

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const createPost = useCreatePost()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [privatePost, setPrivatePost] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)
    createPost.mutate(
      { title, content, categoryId: categoryId ? parseInt(categoryId) : null, tags: tagArray, privatePost },
      {
        onSuccess: (data) => navigate(`/posts/${data.id}`),
      }
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 text-sm mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="aws, docker, kubernetes"
              className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={privatePost} onChange={(e) => setPrivatePost(e.target.checked)} />
            <div className="w-9 h-5 bg-[#334155] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
          </label>
          <span className="text-gray-300 text-sm">{privatePost ? 'Private (only you and admins can see)' : 'Public (visible to everyone)'}</span>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          disabled={createPost.isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createPost.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
