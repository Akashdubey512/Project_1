import React from 'react'
import Navbar from '../components/Navbar'

import Layout from '../components/Layout'
import { useVideos } from '../hooks/useVideos'
import VideoCard from '../components/VideoCard'
import Loader from '../components/common/Loader'

export default function HomePage() {
  const { videos, isLoading, error } = useVideos({ limit: 20 })

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Recommended</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error loading videos: {error}
          </div>
        )}

        {isLoading ? (
          <Loader center size="lg" />
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <span className="text-4xl mb-4">📭</span>
            <p>No videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
