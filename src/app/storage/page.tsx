'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Database,
  Skull,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  HardDrive,
  Clock,
  ChevronRight
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function StoragePage() {
  const { jobs } = useAppStore()
  const completedJobs = jobs.filter(j => j.status === 'completed')

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
              <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Storage</h1>
            </div>
            <Link href="/dashboard" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
              Command
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="salvage-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-acid-500/50 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-acid-400" />
              </div>
            </div>
            <div className="font-display text-3xl text-acid-400 mb-1 neon-text">
              {completedJobs.length}
            </div>
            <div className="text-xs text-slab-500 font-mono uppercase tracking-wider">Datasets</div>
          </div>
          
          <div className="salvage-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-slab-600 flex items-center justify-center">
                <Database className="w-5 h-5 text-slab-400" />
              </div>
            </div>
            <div className="font-display text-3xl text-slab-100 mb-1">
              {completedJobs.reduce((acc, j) => acc + (j.resultCount || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-slab-500 font-mono uppercase tracking-wider">Total Records</div>
          </div>
          
          <div className="salvage-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-slab-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slab-400" />
              </div>
            </div>
            <div className="font-display text-3xl text-slab-100 mb-1">
              30d
            </div>
            <div className="text-xs text-slab-500 font-mono uppercase tracking-wider">Retention</div>
          </div>
        </div>

        {/* Datasets List */}
        <div className="salvage-card">
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slab-800">
            <h2 className="font-display text-lg text-slab-100 uppercase tracking-wide">Extracted Datasets</h2>
          </div>
          
          {completedJobs.length > 0 ? (
            <div className="divide-y-2 divide-slab-800">
              {completedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-slab-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <FolderOpen className="w-5 h-5 text-acid-400" />
                    <div>
                      <div className="font-display text-slab-100 uppercase tracking-wide">{job.name}</div>
                      <div className="text-sm text-slab-500 font-mono">{job.resourceType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slab-400 font-mono">
                      {(job.resultCount || 0).toLocaleString()} records
                    </div>
                    <div className="text-sm text-slab-500 font-mono">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 border-2 border-slab-700 hover:border-acid-500 text-slab-400 hover:text-acid-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 border-2 border-slab-700 hover:border-acid-500 text-slab-400 hover:text-acid-400 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 border-2 border-slab-700 hover:border-oxide-500 text-slab-400 hover:text-oxide-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Database className="w-12 h-12 text-slab-600 mx-auto mb-4" />
              <h3 className="font-display text-slab-100 mb-2 uppercase tracking-wide">No Datasets</h3>
              <p className="text-slab-500 mb-4 font-mono text-sm">Complete an extraction to see data here</p>
              <Link href="/resources" className="salvage-btn inline-flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                START EXTRACTION
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
