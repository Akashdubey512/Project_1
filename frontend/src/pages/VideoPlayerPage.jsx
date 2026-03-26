import { useParams } from 'react-router-dom'
import { useVideo } from '../hooks/useVideo'
import Layout from '../components/Layout'
import Loader from '../components/common/Loader'
import Avatar from '../components/common/Avatar'
import LikeButton from '../components/LikeButton'
import SubscribeButton from '../components/SubscribeButton'
import CommentSection from '../components/CommentSection'

export default function VideoPlayerPage() {
  const { videoId } = useParams()
  const { video, isLoading, error } = useVideo(videoId)

  if (isLoading) return <Layout><Loader center size="lg" /></Layout>
  if (error) return <Layout><div className="p-6 text-red-600">{error}</div></Layout>
  if (!video) return <Layout><div className="p-6">Video not found</div></Layout>

  const owner = video.owner || {}

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player & Info */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-4 relative">
             <video 
               src={video.videoFile} 
               poster={video.thumbnail}
               controls 
               className="w-full h-full object-contain"
               autoPlay
             />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {video.title}
          </h1>

          {/* Action row (Channel info + Buttons) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Avatar src={owner.avatar} alt={owner.username} size="md" />
              <div>
                <h3 className="font-semibold text-gray-900">{owner.fullName || owner.username}</h3>
                <p className="text-xs text-gray-500">
                  {/* Subscriber count needs API or dynamic prop, default 0 for now */}
                  {owner.subscribersCount || '0'} subscribers
                </p>
              </div>
              <div className="ml-2">
                <SubscribeButton 
                  channelId={owner._id} 
                  isSubscribed={owner.isSubscribed} 
                  subscriberCount={owner.subscribersCount}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LikeButton itemId={video._id} type="video" isLiked={video.isLiked} likeCount={video.likesCount} />
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors">
                <span className="text-xl">⤴</span> Share
              </button>
            </div>
          </div>

          {/* Description box */}
          <div className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-xl mt-4 cursor-pointer">
            <div className="font-medium text-sm mb-1 flex gap-2">
              <span>{video.views?.toLocaleString() || 0} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
          </div>

          {/* Comments Section */}
          <CommentSection videoId={video._id} />
        </div>

        {/* Right Column: Suggested Videos (Stub) */}
        <div className="hidden lg:block">
          <h3 className="font-bold text-lg mb-4">Related Videos</h3>
          <div className="space-y-4">
             {/* Placeholder for related videos fetching. Will be built later or just left out depending on time. */}
             <div className="flex gap-2">
               <div className="w-40 aspect-video bg-gray-200 rounded-lg"></div>
               <div className="flex-1">
                 <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
