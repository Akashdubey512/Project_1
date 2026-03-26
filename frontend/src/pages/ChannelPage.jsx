// src/pages/ChannelPage.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { videoService } from '../services/videoService'
import Layout from '../components/Layout'
import Loader from '../components/common/Loader'
import Avatar from '../components/common/Avatar'
import VideoCard from '../components/VideoCard'
import SubscribeButton from '../components/SubscribeButton'

export default function ChannelPage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    
    // Fetch profile and their videos in parallel
    Promise.all([
      authService.getChannelProfile(username).then(res => res.data),
      videoService.getAllVideos({ query: username }) // Assuming backend uses query or userId filter
    ])
    .then(([profileData, videosData]) => {
      if (isMounted) {
        setProfile(profileData)
        setVideos(videosData.docs || videosData)
        setError(null)
      }
    })
    .catch(err => {
      if (isMounted) setError(err.response?.data?.message || 'Failed to load channel')
    })
    .finally(() => {
      if (isMounted) setLoading(false)
    })

    return () => { isMounted = false }
  }, [username])

  if (loading) return <Layout><Loader center size="lg" /></Layout>
  if (error || !profile) return <Layout><div className="p-6 text-red-600">{error || 'Channel not found'}</div></Layout>

  return (
    <Layout>
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-300">
        {profile.coverImage && (
          <img src={profile.coverImage} className="w-full h-full object-cover" alt="Cover" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Channel Header Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 py-6 border-b border-gray-200 -mt-12 md:-mt-16 relative z-10">
           <Avatar src={profile.avatar} alt={profile.username} size="xl" className="border-4 border-white shadow-sm" />
           
           <div className="flex-1 text-center md:text-left mt-10 md:mt-16">
             <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
             <div className="text-gray-600 mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-sm">
               <span>@{profile.username}</span>
               <span className="hidden md:inline">•</span>
               <span>{profile.subscribersCount} subscribers</span>
               <span className="hidden md:inline">•</span>
               <span>{profile.channelsSubscribedToCount} subscribed</span>
             </div>
           </div>

           <div className="md:mt-16">
             <SubscribeButton 
               channelId={profile._id} 
               isSubscribed={profile.isSubscribed} 
               subscriberCount={profile.subscribersCount} 
             />
           </div>
        </div>

        {/* Channel Videos Tab */}
        <div className="py-8">
          <h2 className="text-xl font-bold mb-6">Videos</h2>
          {videos.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No videos yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
