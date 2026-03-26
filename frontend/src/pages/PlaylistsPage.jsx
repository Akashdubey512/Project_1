import { useState, useEffect } from 'react'
import { playlistService } from '../services/playlistService'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import PlaylistCard from '../components/playlist/PlaylistCard'
import Loader from '../components/common/Loader'

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let isMounted = true

    playlistService.getUserPlaylists(user._id)
      .then(res => {
        if (isMounted) setPlaylists(res.data)
      })
      .catch(err => {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load playlists')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [user])

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
            Create Playlist
          </button>
        </div>

        {loading ? (
          <Loader center size="lg" />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-4xl">📂</span>
            <p className="mt-4">You don't have any playlists yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
