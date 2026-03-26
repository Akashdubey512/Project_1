import { useState } from 'react'
import { subscriptionService } from '../services/subscriptionService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SubscribeButton({ channelId, isSubscribed: initialSubscribed, subscriberCount: initialCount }) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed || false)
  const [count, setCount] = useState(initialCount || 0)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      await subscriptionService.toggleSubscription(channelId)
      
      // Toggle local state optimistically
      setIsSubscribed(!isSubscribed)
      setCount(prev => isSubscribed ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Failed to toggle subscription', error)
      // Revert on failure could be added here
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-medium transition-colors ${
        isSubscribed 
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
          : 'bg-black text-white hover:bg-gray-800'
      } disabled:opacity-70`}
    >
      {loading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  )
}
