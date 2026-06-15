import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function VoteButton({ upvotes = 0, downvotes = 0, onUpvote, onDownvote }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const score = upvotes - downvotes

  const handleVote = (fn) => {
    if (!user) {
      navigate('/login')
      return
    }
    fn()
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => handleVote(onUpvote)} className="text-gray-400 hover:text-blue-500 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span className={`text-sm font-medium ${score >= 0 ? 'text-gray-300' : 'text-red-400'}`}>
        {score}
      </span>
      <button onClick={() => handleVote(onDownvote)} className="text-gray-400 hover:text-red-500 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
