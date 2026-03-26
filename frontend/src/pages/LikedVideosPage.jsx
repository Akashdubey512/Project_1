import { useState, useEffect } from 'react'
import { likeService } from '../services/likeService'
import Layout from '../components/Layout'
import VideoCard from '../components/VideoCard'
import Loader from '../components/common/Loader'

export default function LikedVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    likeService.getLikedVideos()
      .then(res => {
        // Backend returns array of likes, each with a populated `video` field
        const likedVideos = res.data.map(like => like.video).filter(v => v !== null)
        if (isMounted) setVideos(likedVideos)
      })
      .catch(err => {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load liked videos')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [])

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>👍</span> Liked Videos
        </h1>

        {loading ? (
          <Loader center size="lg" />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
             <p>No liked videos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
