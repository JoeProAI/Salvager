'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Database, 
  Search, 
  Play, 
  BarChart3,
  Layers,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: BarChart3 },
  { href: '/resources', label: 'Discover', icon: Search },
  { href: '/gather/new', label: 'Gather', icon: Play },
  { href: '/storage', label: 'Storage', icon: Database },
  { href: '/pipelines', label: 'Pipelines', icon: Layers },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-steel-900/95 backdrop-blur-sm border-r border-steel-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-steel-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-salvage-500 to-salvage-700 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">Salvager</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-steel-800 text-steel-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-salvage-500/10 text-salvage-400 border border-salvage-500/20'
                      : 'text-steel-400 hover:bg-steel-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t border-steel-800">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
