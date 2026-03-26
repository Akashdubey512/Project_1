import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <nav className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">▶</div>
        <span className="text-xl font-bold tracking-tight">VidApp</span>
      </Link>

      <div className="flex-1 max-w-xl px-12 hidden sm:block">
        <div className="flex w-full">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-6 py-2 hover:bg-gray-200">
            🔍
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <Link to="/upload" className="text-gray-600 hover:text-black">
              <span className="text-2xl" title="Upload video">➕</span>
            </Link>
            <div className="relative group cursor-pointer">
              <Link to="/profile">
                <Avatar src={user.avatar} alt={user.username || user.fullName} size="sm" />
              </Link>
              {/* Dropdown stub */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block px-2 py-2">
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="font-medium truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-red-600">
                  Log Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-full transition-colors">
               Log in
             </Link>
             <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-full transition-colors">
               Sign up
             </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
