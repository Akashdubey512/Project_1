import { useState } from 'react'
import { likeService } from '../services/likeService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LikeButton({ itemId, type = 'video', isLiked: initialLiked, likeCount: initialCount }) {
  const [isLiked, setIsLiked] = useState(initialLiked || false)
  const [count, setCount] = useState(initialCount || 0)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      
      if (type === 'video') {
         await likeService.toggleVideoLike(itemId)
      } else if (type === 'comment') {
         await likeService.toggleCommentLike(itemId)
      } else if (type === 'tweet') {
         await likeService.toggleTweetLike(itemId)
      }
      
      // Toggle local state
      setIsLiked(!isLiked)
      setCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1)
    } catch (error) {
      console.error('Failed to toggle like', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${
        isLiked ? 'text-blue-600' : 'text-gray-800'
      } disabled:opacity-70`}
    >
      <span className="text-xl">{isLiked ? '👍' : '👍'}</span>
      <span className="font-medium text-sm">{count.toLocaleString()}</span>
    </button>
  )
}
