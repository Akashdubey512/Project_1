import { Link } from 'react-router-dom'

export default function PlaylistCard({ playlist }) {
  if (!playlist) return null
  
  // Use first video's thumbnail as playlist cover, else placeholder
  const thumbnail = playlist.videos && playlist.videos.length > 0 && playlist.videos[0].thumbnail 
    ? playlist.videos[0].thumbnail 
    : 'https://via.placeholder.com/300x169?text=No+Videos'

  return (
    <Link to={`/playlist/${playlist._id}`} className="flex flex-col gap-2 group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img 
          src={thumbnail} 
          alt={playlist.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Overlay showing video count */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="text-xl font-bold">{playlist.videos?.length || 0}</span>
          <span className="text-xs uppercase mt-1 tracking-wider opacity-80">Videos</span>
        </div>
      </div>
      
      <div className="pr-4 mt-1">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {playlist.description || 'No description'}
        </p>
      </div>
    </Link>
  )
}
