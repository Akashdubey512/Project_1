import { useState, useEffect } from 'react'
import { videoService } from '../services/videoService'

export function useVideos(params = {}) {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  // Use JSON stringification to handle object dependency in purely effect-based fetching
  // Not perfect for production but solid for standard React
  const paramsStr = JSON.stringify(params)

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    videoService.getAllVideos(JSON.parse(paramsStr))
      .then(res => {
        if (isMounted) {
            const payload = res.data?.data || res.data
            setVideos(payload?.videos || payload?.docs || (Array.isArray(payload) ? payload : []))
            setHasMore(payload?.hasNextPage || false)
            setError(null)
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message || "Failed to fetch videos")
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

      return () => {
        isMounted = false;
      }
  }, [paramsStr])

  return { videos, isLoading, error, hasMore, setVideos }
}
