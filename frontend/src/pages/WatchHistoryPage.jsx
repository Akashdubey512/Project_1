import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import Layout from '../components/Layout'
import VideoCard from '../components/VideoCard'
import Loader from '../components/common/Loader'

export default function WatchHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    authService.getWatchHistory()
      .then(res => {
        if (isMounted) setHistory(res.data)
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>🕒</span> Watch History
        </h1>

        {loading ? (
          <Loader center size="lg" />
        ) : history.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
             <p>Your watch history is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {history.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
