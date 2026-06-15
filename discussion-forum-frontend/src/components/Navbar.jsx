import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="bg-[#1e293b] border-b border-[#475569] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-blue-500">
              Forum
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <Link to="/categories" className="text-gray-300 hover:text-white transition">Categories</Link>
              {user && (
                <Link to="/create-post" className="text-gray-300 hover:text-white transition">New Post</Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-white transition">Admin</Link>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0f172a] text-gray-200 px-4 py-1.5 rounded-l-md border border-[#475569] focus:outline-none focus:border-blue-500 w-48"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-r-md hover:bg-blue-700">
              Go
            </button>
          </form>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell />
                <Link to={`/users/${user.id}`} className="text-gray-300 hover:text-white text-sm">
                  {user.username}
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-400 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
