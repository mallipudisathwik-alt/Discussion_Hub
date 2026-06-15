import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, deleteCategory, getPendingCategories, approveCategory, rejectCategory } from '../api/categoriesApi'
import { getUsers, deleteUser, updateUser } from '../api/usersApi'
import { getPendingPosts, approvePost, rejectPost } from '../api/postsApi'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import ActivityFeed from '../components/ActivityFeed'

export default function AdminPanel() {
  const { user: currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3B82F6' })
  const [editingUser, setEditingUser] = useState(null)
  const [editRole, setEditRole] = useState('')
  const [tab, setTab] = useState('users')
  const [rejectReason, setRejectReason] = useState({})
  const [showRejectInput, setShowRejectInput] = useState(null)

  if (!isAdmin) {
    navigate('/')
    return null
  }

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers().then((res) => res.data),
  })

  const { data: pendingPosts } = useQuery({
    queryKey: ['pendingPosts'],
    queryFn: () => getPendingPosts().then((res) => res.data),
    enabled: tab === 'pending',
  })

  const { data: pendingCategories } = useQuery({
    queryKey: ['pendingCategories'],
    queryFn: () => getPendingCategories().then((res) => res.data),
    enabled: tab === 'pending',
  })

  const createCategoryMutation = useMutation({
    mutationFn: () => createCategory(newCategory).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setNewCategory({ name: '', description: '', color: '#3B82F6' })
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
    },
  })

  const handleRoleChange = (userId) => {
    updateUserMutation.mutate({ id: userId, data: { role: editRole } })
  }

  const approvePostMutation = useMutation({
    mutationFn: (id) => approvePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPosts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const rejectPostMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectPost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPosts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setShowRejectInput(null)
      setRejectReason({})
    },
  })

  const approveCategoryMutation = useMutation({
    mutationFn: (id) => approveCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCategories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const rejectCategoryMutation = useMutation({
    mutationFn: (id) => rejectCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCategories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const tabs = [
    { key: 'users', label: 'Users' },
    { key: 'categories', label: 'Categories' },
    { key: 'pending', label: `Pending (${(pendingPosts?.length || 0) + (pendingCategories?.length || 0)})` },
    { key: 'activity', label: 'Activity' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Admin Panel</h1>

      <div className="flex gap-2 mb-6 border-b border-[#475569] pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-t-md transition ${tab === t.key ? 'bg-[#1e293b] text-blue-400 border border-[#475569] border-b-0' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">User Management</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users?.map((u) => (
              <div key={u.id} className="flex items-center justify-between bg-[#0f172a] rounded px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/users/${u.id}`} className="text-gray-200 text-sm hover:text-blue-400">
                      {u.username}
                    </Link>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'ADMIN' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}`}>
                    {u.role}
                  </span>
                  {editingUser === u.id ? (
                    <div className="flex items-center gap-1">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-[#1e293b] text-gray-200 border border-[#475569] rounded text-xs px-1 py-0.5"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button onClick={() => handleRoleChange(u.id)} className="text-green-400 text-xs hover:text-green-300">
                        Save
                      </button>
                      <button onClick={() => setEditingUser(null)} className="text-gray-500 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingUser(u.id); setEditRole(u.role) }}
                      className="text-gray-400 hover:text-blue-400 text-xs"
                    >
                      Role
                    </button>
                  )}
                  {currentUser?.id !== u.id && (
                    <button
                      onClick={() => { if (confirm(`Delete user ${u.username}?`)) deleteUserMutation.mutate(u.id) }}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Category Management</h2>
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full bg-[#0f172a] text-gray-200 border border-[#475569] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <button
                onClick={() => createCategoryMutation.mutate()}
                disabled={!newCategory.name || createCategoryMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {createCategoryMutation.isPending ? 'Creating...' : 'Add Category'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-[#0f172a] rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-300 text-sm">{cat.name}</span>
                  <span className="text-gray-500 text-xs">({cat.postCount} posts)</span>
                </div>
                <button onClick={() => deleteCategoryMutation.mutate(cat.id)} className="text-red-400 hover:text-red-300 text-xs">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pending' && (
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Pending Posts ({pendingPosts?.length || 0})</h2>
            {!pendingPosts || pendingPosts.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending posts</p>
            ) : (
              <div className="space-y-3">
                {pendingPosts.map((post) => (
                  <div key={post.id} className="bg-[#0f172a] rounded p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <Link to={`/posts/${post.id}`} className="text-gray-200 font-medium hover:text-blue-400">{post.title}</Link>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
                        <p className="text-gray-500 text-xs mt-1">by user #{post.userId} &middot; {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => approvePostMutation.mutate(post.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Approve
                        </button>
                        {showRejectInput === post.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="Reason (optional)"
                              value={rejectReason[post.id] || ''}
                              onChange={(e) => setRejectReason({ ...rejectReason, [post.id]: e.target.value })}
                              className="bg-[#1e293b] text-gray-200 border border-[#475569] rounded text-xs px-2 py-1 w-32"
                            />
                            <button
                              onClick={() => rejectPostMutation.mutate({ id: post.id, reason: rejectReason[post.id] || '' })}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button onClick={() => setShowRejectInput(null)} className="text-gray-500 text-xs">X</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowRejectInput(post.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Pending Categories ({pendingCategories?.length || 0})</h2>
            {!pendingCategories || pendingCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending categories</p>
            ) : (
              <div className="space-y-3">
                {pendingCategories.map((cat) => (
                  <div key={cat.id} className="bg-[#0f172a] rounded p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-gray-200 text-sm font-medium">{cat.name}</span>
                        <span className="text-gray-500 text-xs">by user #{cat.userId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveCategoryMutation.mutate(cat.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => { if (confirm('Reject this category?')) rejectCategoryMutation.mutate(cat.id) }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-6">
          <ActivityFeed />
        </div>
      )}
    </div>
  )
}
