import { useState, useEffect } from 'react'
import { videoService } from '../services/videoService'

export function useVideo(videoId) {
  const [video, setVideo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!videoId) return

    let isMounted = true
    setIsLoading(true)

    videoService.getVideoById(videoId)
      .then(res => {
        if (isMounted) {
          setVideo(res.data)
          setError(null)
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message || "Failed to fetch video")
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [videoId])

  return { video, isLoading, error, setVideo }
}
