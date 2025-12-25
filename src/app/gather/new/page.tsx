'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Database, 
  ArrowLeft,
  Play,
  Loader2,
  Settings,
  Info,
  Skull,
  Crosshair,
  Terminal,
  Zap
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

function GatherForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resourceId = searchParams.get('resource')
  
  const { addJob } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [resourceDetails, setResourceDetails] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [jobName, setJobName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (resourceId) {
      fetchResourceDetails()
    }
  }, [resourceId])

  const fetchResourceDetails = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`)
      const data = await response.json()
      if (data.success) {
        setResourceDetails(data.resource)
        setJobName(`${data.resource.name} - ${new Date().toLocaleDateString()}`)
      }
    } catch (error) {
      console.error('Failed to fetch resource details:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          input: formData,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        addJob({
          id: data.task.id,
          name: jobName,
          resourceType: resourceDetails?.name || resourceId || 'Unknown',
          status: 'running',
          createdAt: new Date().toISOString(),
        })
        
        router.push(`/jobs/${data.task.id}`)
      } else {
        setError(data.error || 'Failed to start gathering')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to start gathering')
    } finally {
      setIsLoading(false)
    }
  }

  const renderInputField = (key: string, schema: any) => {
    const type = schema.type || 'string'
    const description = schema.description || ''
    
    switch (type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[key] || false}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
              className="w-5 h-5 rounded border-steel-600 bg-steel-800 text-salvage-500 focus:ring-salvage-500"
            />
            <span className="text-steel-300">{key}</span>
          </label>
        )
      case 'number':
      case 'integer':
        return (
          <input
            type="number"
            value={formData[key] || ''}
            onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
            className="salvage-input"
            placeholder={description}
          />
        )
      case 'array':
        return (
          <textarea
            value={formData[key] || ''}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value.split('\n') })}
            className="salvage-input min-h-[100px]"
            placeholder={`${description}\n(One item per line)`}
          />
        )
      default:
        return (
          <input
            type="text"
            value={formData[key] || ''}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className="salvage-input"
            placeholder={description}
          />
        )
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
            <Link href="/resources" className="p-2 border-2 border-slab-700 hover:border-acid-500 text-slab-400 hover:text-acid-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
                <Skull className="w-5 h-5 text-acid-500" />
              </div>
              <div>
                <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">New Extraction</h1>
                <p className="text-sm text-slab-500 font-mono">&gt; Configure operation parameters</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 border-2 border-oxide-500/50 bg-oxide-500/10 text-oxide-400 font-mono text-sm">
              <span className="text-oxide-500">[ERROR]</span> {error}
            </div>
          )}

          {/* Job Name */}
          <div className="salvage-card p-6">
            <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Terminal className="w-5 h-5 text-acid-400" />
              Operation Config
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Operation Name</label>
                <input
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                  placeholder="> Enter operation identifier"
                  required
                />
              </div>

              {resourceDetails && (
                <div className="p-4 border-2 border-slab-700 bg-slab-800/50">
                  <div className="flex items-start gap-3">
                    <Crosshair className="w-5 h-5 text-acid-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-slab-100 uppercase tracking-wide">{resourceDetails.name}</h3>
                      <p className="text-sm text-slab-400 mt-1 font-mono">{resourceDetails.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Parameters */}
          {resourceDetails?.inputSchema && (
            <div className="salvage-card p-6">
              <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Settings className="w-5 h-5 text-acid-400" />
                Parameters
              </h2>
              
              <div className="space-y-4">
                {Object.entries(resourceDetails.inputSchema.properties || {}).map(([key, schema]: [string, any]) => (
                  <div key={key}>
                    <label className="salvage-label">
                      {key}
                      {resourceDetails.inputSchema.required?.includes(key) && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                    {renderInputField(key, schema)}
                    {schema.description && (
                      <p className="text-xs text-steel-500 mt-1">{schema.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Input for simple cases */}
          {!resourceDetails?.inputSchema && (
            <div className="salvage-card p-6">
              <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Crosshair className="w-5 h-5 text-acid-400" />
                Target Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Query / Target URL</label>
                  <input
                    type="text"
                    value={formData.query || ''}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                    placeholder="> Enter target query or URL"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Max Results</label>
                  <input
                    type="number"
                    value={formData.maxResults || 100}
                    onChange={(e) => setFormData({ ...formData, maxResults: parseInt(e.target.value) })}
                    className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors"
                    min={1}
                    max={10000}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/resources" className="salvage-btn-secondary">
              ABORT
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="salvage-btn inline-flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              EXECUTE
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function NewGatherPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slab-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-acid-400 animate-spin mb-4" />
        <p className="font-mono text-acid-400 text-sm animate-pulse">INITIALIZING...</p>
      </div>
    }>
      <GatherForm />
    </Suspense>
  )
}
