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
  FileText
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
    <div className="min-h-screen bg-steel-950 grid-pattern">
      {/* Header */}
      <header className="bg-steel-900/80 backdrop-blur-sm border-b border-steel-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-salvage-500 to-salvage-700 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-white">Salvager</span>
              </Link>
              <span className="text-steel-600">/</span>
              <h1 className="font-display text-lg font-semibold text-white">Discover Resources</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="salvage-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="salvage-input pl-12"
                placeholder="Search for resource types (e.g., 'Instagram posts', 'Google Maps', 'product reviews')"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="salvage-btn inline-flex items-center gap-2 px-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-salvage-500/10 text-salvage-400 border border-salvage-500/20'
                    : 'bg-steel-800/50 text-steel-400 hover:bg-steel-800 hover:text-white'
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
          <p className="text-steel-400">
            {hasSearched ? `${resources.length} resources found` : 'Search to discover available resources'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-steel-700 text-white' : 'text-steel-500 hover:text-white'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-steel-700 text-white' : 'text-steel-500 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-salvage-400 animate-spin" />
          </div>
        ) : resources.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {resources.map((resource) => {
              const Icon = getCategoryIcon(resource.category)
              return viewMode === 'grid' ? (
                <Link
                  key={resource.id}
                  href={`/gather/new?resource=${resource.id}`}
                  className="salvage-card p-6 hover:border-salvage-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-salvage-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-salvage-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-salvage-400 transition-colors truncate">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-steel-500 mt-1 line-clamp-2">
                        {resource.description}
                      </p>
                      <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-steel-800 text-steel-400">
                        {resource.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={resource.id}
                  href={`/gather/new?resource=${resource.id}`}
                  className="salvage-card p-4 flex items-center gap-4 hover:border-salvage-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-salvage-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-salvage-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-salvage-400 transition-colors">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-steel-500 truncate">
                      {resource.description}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-steel-800 text-steel-400">
                    {resource.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-steel-600 group-hover:text-salvage-400" />
                </Link>
              )
            })}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-steel-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-white mb-2">No resources found</h3>
            <p className="text-steel-500">Try a different search term or browse categories</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-steel-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-white mb-2">Discover Resources</h3>
            <p className="text-steel-500 max-w-md mx-auto">
              Search for data sources across social media, e-commerce, search engines, maps, and more.
              Over 8,000 resource types available.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
