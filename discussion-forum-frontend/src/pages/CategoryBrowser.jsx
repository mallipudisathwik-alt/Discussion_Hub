import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import SkeletonLoader from '../components/SkeletonLoader'

const iconMap = {
  'cloud': '☁️',
  'code': '💻',
  'database': '🗄️',
  'security': '🔒',
  'devops': '⚙️',
  'ai': '🤖',
  'general': '💬',
}

export default function CategoryBrowser() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#3B82F6')

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })

  const [error, setError] = useState('')
  const createMutation = useMutation({
    mutationFn: () => createCategory({ name, description, color }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setName('')
      setDescription('')
      setColor('#3B82F6')
      setShowForm(false)
      setError('')
    },
    onError: (err) => {
      console.error('Create category error:', err)
      const detail = err?.response?.data?.detail || err?.response?.data?.message || err.message
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail))
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Categories</h1>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {showForm ? 'Cancel' : 'New Category'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-[#1e293b] border border-[#475569] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#475569] rounded-md px-1 py-1 h-9"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              rows={2}
            />
          </div>
          {error && (
            <div className="mt-3 text-red-400 text-sm">{error}</div>
          )}
          <button
            onClick={() => createMutation.mutate()}
            disabled={!name.trim() || createMutation.isPending}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      )}

      {isLoading ? (
        <SkeletonLoader count={6} type="category" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/?categoryId=${cat.id}`}
              className="bg-[#1e293b] rounded-lg border border-[#475569] p-5 hover:border-blue-500/50 transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{iconMap[cat.slug] || iconMap['general']}</span>
                <div>
                  <h3 className="text-gray-100 font-semibold group-hover:text-blue-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-xs">{cat.postCount} posts</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{cat.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#3B82F6' }} />
                <span className="text-gray-500 text-xs">{cat.slug}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
