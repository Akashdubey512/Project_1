import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Liked Videos', path: '/liked', icon: '👍' },
    { name: 'Playlists', path: '/playlists', icon: '📂' },
    { name: 'Subscriptions', path: '/subscriptions', icon: '📺' },
    { name: 'Tweets', path: '/tweets', icon: '🐦' },
    { name: 'History', path: '/history', icon: '🕒' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 hidden md:block">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-gray-200 p-4 mt-4">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl">📊</span>
          <span>Your Dashboard</span>
        </Link>
      </div>
    </aside>
  )
}
