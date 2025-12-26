'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Skull,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Terminal,
  Database,
  Loader2
} from 'lucide-react'
import { useAppStore, GatheringJob } from '@/lib/store'

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const { jobs, updateJob } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [demoProgress, setDemoProgress] = useState(0)
  const [demoComplete, setDemoComplete] = useState(false)
  
  const job = jobs.find(j => j.id === jobId)
  const isDemo = jobId?.startsWith('demo-')

  useEffect(() => {
    // Simulate demo progress
    if (isDemo && !demoComplete) {
      const interval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setDemoComplete(true)
            if (job) {
              updateJob(jobId, { 
                status: 'completed', 
                resultCount: Math.floor(Math.random() * 500) + 50 
              })
            }
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isDemo, demoComplete, job, jobId, updateJob])

  const getStatusIcon = (status?: GatheringJob['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-6 h-6 text-acid-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-acid-400" />
      case 'failed':
        return <XCircle className="w-6 h-6 text-oxide-400" />
      default:
        return <Clock className="w-6 h-6 text-slab-400" />
    }
  }

  const getStatusLabel = (status?: GatheringJob['status']) => {
    switch (status) {
      case 'running':
        return <span className="text-sm px-3 py-1 bg-acid-500/20 text-acid-400 font-mono uppercase">Running</span>
      case 'completed':
        return <span className="text-sm px-3 py-1 bg-acid-500/20 text-acid-400 font-mono uppercase">Complete</span>
      case 'failed':
        return <span className="text-sm px-3 py-1 bg-oxide-500/20 text-oxide-400 font-mono uppercase">Failed</span>
      default:
        return <span className="text-sm px-3 py-1 bg-slab-700 text-slab-400 font-mono uppercase">Pending</span>
    }
  }

  return (
    <div className="min-h-screen bg-slab-950">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <header className="bg-slab-900/95 backdrop-blur-sm border-b-2 border-slab-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="p-2 border-2 border-slab-700 hover:border-acid-500 text-slab-400 hover:text-acid-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
                <Skull className="w-5 h-5 text-acid-500" />
              </div>
              <div>
                <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Operation Details</h1>
                <p className="text-sm text-slab-500 font-mono">&gt; {jobId?.slice(0, 20)}...</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {job ? (
          <>
            {/* Status Card */}
            <div className="salvage-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(job.status)}
                  <div>
                    <h2 className="font-display text-xl text-slab-100 uppercase tracking-wide">{job.name}</h2>
                    <p className="text-slab-500 font-mono text-sm">{job.resourceType}</p>
                  </div>
                </div>
                {getStatusLabel(job.status)}
              </div>

              {/* Progress bar for running jobs */}
              {job.status === 'running' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slab-500 font-mono uppercase tracking-wider">Progress</span>
                    <span className="text-xs text-acid-400 font-mono">{Math.round(isDemo ? demoProgress : 50)}%</span>
                  </div>
                  <div className="h-2 bg-slab-800 border border-slab-700">
                    <div 
                      className="h-full bg-acid-500 transition-all duration-300"
                      style={{ width: `${isDemo ? demoProgress : 50}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Demo mode notice */}
              {isDemo && (
                <div className="p-4 border-2 border-hazard-500/30 bg-hazard-500/10 mb-6">
                  <p className="text-hazard-400 font-mono text-sm">
                    <span className="text-hazard-500">[DEMO MODE]</span> This is a simulated extraction. 
                    Configure RESOURCE_GATEWAY_TOKEN for real data gathering.
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border-2 border-slab-700 bg-slab-800/50">
                  <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-1">Started</div>
                  <div className="text-slab-100 font-mono">{new Date(job.createdAt).toLocaleString()}</div>
                </div>
                <div className="p-4 border-2 border-slab-700 bg-slab-800/50">
                  <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-1">Status</div>
                  <div className="text-slab-100 font-mono uppercase">{job.status}</div>
                </div>
                <div className="p-4 border-2 border-slab-700 bg-slab-800/50">
                  <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-1">Records</div>
                  <div className="text-acid-400 font-mono">{job.resultCount?.toLocaleString() || '—'}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {job.status === 'completed' && (
              <div className="salvage-card p-6">
                <h3 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <Database className="w-5 h-5 text-acid-400" />
                  Results
                </h3>
                
                <div className="flex items-center gap-4">
                  <button className="salvage-btn inline-flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    VIEW DATA
                  </button>
                  <button className="salvage-btn-secondary inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    EXPORT JSON
                  </button>
                  <button className="salvage-btn-secondary inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    EXPORT CSV
                  </button>
                </div>
              </div>
            )}

            {/* Logs */}
            <div className="salvage-card p-6">
              <h3 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Terminal className="w-5 h-5 text-acid-400" />
                Operation Log
              </h3>
              
              <div className="bg-slab-900 border-2 border-slab-700 p-4 font-mono text-sm max-h-64 overflow-y-auto">
                <div className="text-slab-500">[{new Date(job.createdAt).toISOString()}] Operation initiated</div>
                <div className="text-slab-500">[{new Date(job.createdAt).toISOString()}] Connecting to target...</div>
                {job.status === 'running' && (
                  <>
                    <div className="text-acid-400">[{new Date().toISOString()}] Extraction in progress...</div>
                    <div className="text-acid-400 animate-pulse">▌</div>
                  </>
                )}
                {job.status === 'completed' && (
                  <>
                    <div className="text-acid-400">[{new Date().toISOString()}] Extraction complete</div>
                    <div className="text-acid-400">[{new Date().toISOString()}] {job.resultCount} records extracted</div>
                    <div className="text-slab-500">[{new Date().toISOString()}] Operation finished successfully</div>
                  </>
                )}
                {job.status === 'failed' && (
                  <div className="text-oxide-400">[{new Date().toISOString()}] Operation failed</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="salvage-card p-12 text-center">
            <Terminal className="w-12 h-12 text-slab-600 mx-auto mb-4" />
            <h3 className="font-display text-xl text-slab-100 mb-2 uppercase tracking-wide">Operation Not Found</h3>
            <p className="text-slab-500 mb-6 font-mono text-sm">This operation may have expired or doesn't exist</p>
            <Link href="/jobs" className="salvage-btn inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              VIEW ALL OPERATIONS
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
