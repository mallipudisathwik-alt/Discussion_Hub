import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import CategoryBrowser from './pages/CategoryBrowser'
import SearchResults from './pages/SearchResults'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import { useAuth } from './context/AuthContext'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0f172a]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/categories" element={<CategoryBrowser />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}

export default App
