'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Database, 
  Search, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Layers,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAppStore, GatheringJob } from '@/lib/store'

export default function Dashboard() {
  const { jobs, user, sidebarOpen, setSidebarOpen } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'storage'>('overview')
  const [isLoading, setIsLoading] = useState(false)

  const recentJobs = jobs.slice(0, 5)
  const runningJobs = jobs.filter(j => j.status === 'running')
  const completedJobs = jobs.filter(j => j.status === 'completed')

  const stats = [
    { 
      label: 'Active Tasks', 
      value: runningJobs.length, 
      icon: Play, 
      color: 'salvage' 
    },
    { 
      label: 'Completed', 
      value: completedJobs.length, 
      icon: CheckCircle, 
      color: 'salvage' 
    },
    { 
      label: 'Total Resources', 
      value: jobs.reduce((acc, j) => acc + (j.resultCount || 0), 0).toLocaleString(), 
      icon: Database, 
      color: 'rust' 
    },
    { 
      label: 'This Week', 
      value: jobs.filter(j => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(j.createdAt) > weekAgo
      }).length, 
      icon: BarChart3, 
      color: 'steel' 
    },
  ]

  const getStatusIcon = (status: GatheringJob['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 text-salvage-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-salvage-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-steel-400" />
    }
  }

  return (
    <div className="min-h-screen bg-steel-950 grid-pattern">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-steel-900/95 backdrop-blur-sm border-r border-steel-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-steel-800">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-salvage-500 to-salvage-700 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">Salvager</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-salvage-500/10 text-salvage-400 border border-salvage-500/20">
              <BarChart3 className="w-5 h-5" />
              <span>Overview</span>
            </Link>
            <Link href="/resources" className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
              <span>Discover</span>
            </Link>
            <Link href="/gather" className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <Play className="w-5 h-5" />
              <span>Gather</span>
            </Link>
            <Link href="/storage" className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <Database className="w-5 h-5" />
              <span>Storage</span>
            </Link>
            <Link href="/pipelines" className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
              <span>Pipelines</span>
            </Link>
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t border-steel-800">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-steel-400 hover:bg-steel-800/50 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-steel-800 text-white"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-steel-400">Monitor your resource gathering operations</p>
            </div>
            <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Gathering
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="salvage-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === 'salvage' ? 'bg-salvage-500/10 text-salvage-400' :
                      stat.color === 'rust' ? 'bg-rust-500/10 text-rust-400' :
                      'bg-steel-700/50 text-steel-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-display text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-steel-500">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Recent Jobs */}
          <div className="salvage-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-steel-800">
              <h2 className="font-display text-lg font-semibold text-white">Recent Tasks</h2>
              <Link href="/jobs" className="text-sm text-salvage-400 hover:text-salvage-300 inline-flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentJobs.length > 0 ? (
              <div className="divide-y divide-steel-800">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-steel-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-medium text-white">{job.name}</div>
                        <div className="text-sm text-steel-500">{job.resourceType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {job.resultCount !== undefined && (
                        <div className="text-sm text-steel-400">
                          {job.resultCount.toLocaleString()} items
                        </div>
                      )}
                      <div className="text-sm text-steel-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <Link href={`/jobs/${job.id}`} className="text-salvage-400 hover:text-salvage-300">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Database className="w-12 h-12 text-steel-600 mx-auto mb-4" />
                <h3 className="font-medium text-white mb-2">No tasks yet</h3>
                <p className="text-steel-500 mb-4">Start gathering resources to see them here</p>
                <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Start Gathering
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
