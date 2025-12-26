'use client'

import Link from 'next/link'
import { 
  Skull,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Play,
  Radio
} from 'lucide-react'
import { useAppStore, GatheringJob } from '@/lib/store'

export default function JobsPage() {
  const { jobs } = useAppStore()

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

  const getStatusLabel = (status: GatheringJob['status']) => {
    switch (status) {
      case 'running':
        return <span className="text-xs px-2 py-1 bg-acid-500/20 text-acid-400 font-mono uppercase">Running</span>
      case 'completed':
        return <span className="text-xs px-2 py-1 bg-acid-500/20 text-acid-400 font-mono uppercase">Complete</span>
      case 'failed':
        return <span className="text-xs px-2 py-1 bg-oxide-500/20 text-oxide-400 font-mono uppercase">Failed</span>
      default:
        return <span className="text-xs px-2 py-1 bg-slab-700 text-slab-400 font-mono uppercase">Pending</span>
    }
  }

  return (
    <div className="min-h-screen bg-slab-950">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <header className="bg-slab-900/95 backdrop-blur-sm border-b-2 border-slab-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
                  <Skull className="w-5 h-5 text-acid-500" />
                </div>
                <span className="font-display text-xl text-acid-500 tracking-wider">SALVAGE OPS</span>
              </Link>
              <span className="text-slab-600 font-mono">/</span>
              <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Operations</h1>
            </div>
            <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2 text-sm">
              <Play className="w-4 h-4" />
              NEW OP
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Jobs List */}
        <div className="salvage-card">
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slab-800">
            <h2 className="font-display text-lg text-slab-100 uppercase tracking-wide">All Operations</h2>
            <span className="text-sm text-slab-500 font-mono">{jobs.length} total</span>
          </div>
          
          {jobs.length > 0 ? (
            <div className="divide-y-2 divide-slab-800">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-slab-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-display text-slab-100 uppercase tracking-wide">{job.name}</div>
                      <div className="text-sm text-slab-500 font-mono">{job.resourceType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {getStatusLabel(job.status)}
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
              <h3 className="font-display text-slab-100 mb-2 uppercase tracking-wide">No Operations</h3>
              <p className="text-slab-500 mb-4 font-mono text-sm">Launch your first extraction operation</p>
              <Link href="/gather/new" className="salvage-btn inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                LAUNCH OP
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
