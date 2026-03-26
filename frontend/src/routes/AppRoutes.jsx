import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import VideoPlayerPage from '../pages/VideoPlayerPage'
import ChannelPage from '../pages/ChannelPage'
import PlaylistsPage from '../pages/PlaylistsPage'
import LikedVideosPage from '../pages/LikedVideosPage'
import WatchHistoryPage from '../pages/WatchHistoryPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/video/:videoId" element={<VideoPlayerPage />} />
        <Route path="/channel/:username" element={<ChannelPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/playlists" 
          element={
            <ProtectedRoute>
              <PlaylistsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/liked" 
          element={
            <ProtectedRoute>
              <LikedVideosPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <WatchHistoryPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
