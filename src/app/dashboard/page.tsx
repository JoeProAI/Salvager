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
  X,
  Skull,
  Crosshair,
  Radio,
  Container,
  Users
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
        return <RefreshCw className="w-4 h-4 text-acid-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-acid-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-oxide-400" />
      default:
        return <Clock className="w-4 h-4 text-slab-400" />
    }
  }

  return (
    <div className="min-h-screen bg-slab-950">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slab-900/95 backdrop-blur-sm border-r-2 border-slab-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b-2 border-slab-800">
            <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
              <Skull className="w-5 h-5 text-acid-500" />
            </div>
            <span className="font-display text-xl text-acid-500 tracking-wider">SALVAGE OPS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-acid-500/10 text-acid-400 border-2 border-acid-500/30 font-mono text-sm uppercase tracking-wider">
              <Radio className="w-5 h-5" />
              <span>Command</span>
            </Link>
            <Link href="/resources" className="flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-acid-400 transition-colors font-mono text-sm uppercase tracking-wider border-2 border-transparent hover:border-slab-700">
              <Crosshair className="w-5 h-5" />
              <span>Discover</span>
            </Link>
            <Link href="/gather/new" className="flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-acid-400 transition-colors font-mono text-sm uppercase tracking-wider border-2 border-transparent hover:border-slab-700">
              <Container className="w-5 h-5" />
              <span>Extract</span>
            </Link>
            <Link href="/crews" className="flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-acid-400 transition-colors font-mono text-sm uppercase tracking-wider border-2 border-transparent hover:border-slab-700">
              <Users className="w-5 h-5" />
              <span>Crews</span>
            </Link>
            <Link href="/storage" className="flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-acid-400 transition-colors font-mono text-sm uppercase tracking-wider border-2 border-transparent hover:border-slab-700">
              <Database className="w-5 h-5" />
              <span>Storage</span>
            </Link>
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t-2 border-slab-800">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-slab-200 transition-colors font-mono text-sm uppercase tracking-wider">
              <Settings className="w-5 h-5" />
              <span>Config</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slab-400 hover:bg-slab-800/50 hover:text-slab-200 transition-colors font-mono text-sm uppercase tracking-wider">
              <LogOut className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 border-2 border-slab-700 bg-slab-900 text-slab-100"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-slab-100 mb-2 uppercase tracking-wide">Command Center</h1>
              <p className="text-slab-400 font-mono text-sm">&gt; Monitoring active operations...</p>
            </div>
            <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              NEW OP
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="salvage-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 border-2 flex items-center justify-center ${
                      stat.color === 'salvage' ? 'border-acid-500/50 text-acid-400' :
                      stat.color === 'rust' ? 'border-oxide-500/50 text-oxide-400' :
                      'border-slab-600 text-slab-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="font-display text-3xl text-acid-400 mb-1 neon-text">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slab-500 font-mono uppercase tracking-wider">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Recent Jobs */}
          <div className="salvage-card">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slab-800">
              <h2 className="font-display text-lg text-slab-100 uppercase tracking-wide">Active Operations</h2>
              <Link href="/jobs" className="text-sm text-acid-400 hover:text-acid-300 inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentJobs.length > 0 ? (
              <div className="divide-y-2 divide-slab-800">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-slab-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-display text-slab-100 uppercase tracking-wide">{job.name}</div>
                        <div className="text-sm text-slab-500 font-mono">{job.resourceType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {job.resultCount !== undefined && (
                        <div className="text-sm text-slab-400 font-mono">
                          {job.resultCount.toLocaleString()} items
                        </div>
                      )}
                      <div className="text-sm text-slab-500 font-mono">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <Link href={`/jobs/${job.id}`} className="text-acid-400 hover:text-acid-300">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Radio className="w-12 h-12 text-slab-600 mx-auto mb-4" />
                <h3 className="font-display text-slab-100 mb-2 uppercase tracking-wide">No Active Ops</h3>
                <p className="text-slab-500 mb-4 font-mono text-sm">Deploy a crew to start extraction</p>
                <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  LAUNCH OP
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
