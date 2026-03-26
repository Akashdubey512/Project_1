import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 w-full bg-gray-50/50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
