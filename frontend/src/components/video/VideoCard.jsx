import { Link } from 'react-router-dom'
import Avatar from './Avatar'

export default function VideoCard({ video }) {
  if (!video) return null

  // Backend model info: video has title, thumbnail, views, owner (ObjectId/User), duration, createdAt
  const timeAgo = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const owner = video.owner || {} // Mongoose populate should handle this

  return (
    <Link to={`/video/${video._id}`} className="flex flex-col gap-3 group">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Info wrapper */}
      <div className="flex gap-3 pr-4">
        {/* Channel Avatar */}
        <div className="pt-1">
          <Avatar src={owner.avatar} alt={owner.username || 'U'} size="sm" />
        </div>

        {/* Text Info */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            <p className="hover:text-gray-800 transition-colors">
              {owner.username || owner.fullName || 'Channel Name'}
            </p>
            <div className="flex items-center text-xs mt-0.5">
              <span>{video.views?.toLocaleString() || 0} views</span>
              <span className="mx-1">•</span>
              <span>{video.createdAt ? timeAgo(video.createdAt) : 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
