'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Database, 
  Filter,
  Grid,
  List,
  ChevronRight,
  Loader2,
  Package,
  Globe,
  ShoppingCart,
  Map,
  MessageSquare,
  Image,
  Video,
  FileText,
  Skull,
  Crosshair,
  Terminal
} from 'lucide-react'

interface ResourceType {
  id: string
  name: string
  description: string
  category: string
}

const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: Grid },
  { id: 'social', name: 'Social Media', icon: MessageSquare },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart },
  { id: 'search', name: 'Search Engines', icon: Search },
  { id: 'maps', name: 'Maps & Location', icon: Map },
  { id: 'media', name: 'Media & Images', icon: Image },
  { id: 'web', name: 'Web Content', icon: Globe },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<ResourceType[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch('/api/resources/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 20 }),
      })

      const data = await response.json()
      if (data.success) {
        setResources(data.resources)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'social': return MessageSquare
      case 'ecommerce': return ShoppingCart
      case 'search': return Search
      case 'maps': return Map
      case 'media': return Image
      case 'web': return Globe
      default: return Package
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
              <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Discover</h1>
            </div>
            <Link href="/dashboard" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="salvage-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Crosshair className="w-5 h-5 text-acid-500" />
            <span className="font-mono text-acid-400 text-sm uppercase tracking-wider">Target Acquisition</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slab-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-12 py-4 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                placeholder="> Search targets (e.g., 'Instagram posts', 'Google Maps', 'product data')"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="salvage-btn inline-flex items-center gap-2 px-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              SCAN
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap transition-colors font-mono text-sm uppercase tracking-wider ${
                  selectedCategory === cat.id
                    ? 'bg-acid-500/10 text-acid-400 border-2 border-acid-500/30'
                    : 'bg-slab-800/50 text-slab-400 border-2 border-slab-700 hover:border-slab-600 hover:text-slab-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slab-400 font-mono text-sm">
            {hasSearched ? `> ${resources.length} targets acquired` : '> Awaiting scan parameters...'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border-2 ${viewMode === 'grid' ? 'border-acid-500 text-acid-400' : 'border-slab-700 text-slab-500 hover:text-slab-300'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-2 ${viewMode === 'list' ? 'border-acid-500 text-acid-400' : 'border-slab-700 text-slab-500 hover:text-slab-300'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-acid-400 animate-spin mb-4" />
            <p className="font-mono text-acid-400 text-sm animate-pulse">SCANNING TARGETS...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {resources.map((resource) => {
              const Icon = getCategoryIcon(resource.category)
              return viewMode === 'grid' ? (
                <Link
                  key={resource.id}
                  href={`/gather/new?resource=${resource.id}`}
                  className="salvage-card p-6 hover:border-acid-500/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border-2 border-slab-600 group-hover:border-acid-500 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-6 h-6 text-slab-400 group-hover:text-acid-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-slab-100 group-hover:text-acid-400 transition-colors truncate uppercase tracking-wide">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-slab-500 mt-1 line-clamp-2 font-mono">
                        {resource.description}
                      </p>
                      <span className="inline-block mt-3 text-xs px-2 py-1 bg-slab-800 text-slab-400 font-mono uppercase">
                        {resource.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={resource.id}
                  href={`/gather/new?resource=${resource.id}`}
                  className="salvage-card p-4 flex items-center gap-4 hover:border-acid-500/50 transition-all group"
                >
                  <div className="w-10 h-10 border-2 border-slab-600 group-hover:border-acid-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-5 h-5 text-slab-400 group-hover:text-acid-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-slab-100 group-hover:text-acid-400 transition-colors uppercase tracking-wide">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-slab-500 truncate font-mono">
                      {resource.description}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-slab-800 text-slab-400 font-mono uppercase">
                    {resource.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slab-600 group-hover:text-acid-400 transition-colors" />
                </Link>
              )
            })}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slab-600 mx-auto mb-4" />
            <h3 className="font-display text-xl text-slab-100 mb-2 uppercase tracking-wide">No Targets Found</h3>
            <p className="text-slab-500 font-mono">Adjust scan parameters and retry</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Crosshair className="w-16 h-16 text-slab-600 mx-auto mb-4" />
            <h3 className="font-display text-xl text-slab-100 mb-2 uppercase tracking-wide">Target Acquisition</h3>
            <p className="text-slab-500 max-w-md mx-auto font-mono">
              Scan for data sources across social media, e-commerce, search engines, maps, and more.
              1,500+ resource types available.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
