'use client'

import { useState } from 'react'
import { 
  Database, 
  Search, 
  Zap, 
  Package, 
  ArrowRight, 
  Layers,
  Activity,
  Shield,
  Cpu
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const features = [
    {
      id: 'discover',
      icon: Search,
      title: 'Resource Discovery',
      description: 'Locate and catalog data sources across platforms, search engines, maps, and commerce sites.',
      color: 'salvage',
    },
    {
      id: 'gather',
      icon: Package,
      title: 'Data Gathering',
      description: 'Extract structured data from any web resource with intelligent parsing and validation.',
      color: 'rust',
    },
    {
      id: 'pipeline',
      icon: Layers,
      title: 'Pipeline Automation',
      description: 'Create automated workflows that gather, transform, and deliver data on schedule.',
      color: 'salvage',
    },
    {
      id: 'monitor',
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track resource acquisition status, logs, and performance metrics in real-time.',
      color: 'rust',
    },
  ]

  const stats = [
    { label: 'Resource Types', value: '8,000+' },
    { label: 'Data Points/Day', value: '10M+' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Avg Response', value: '<2s' },
  ]

  return (
    <div className="min-h-screen grid-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-steel-950/80 backdrop-blur-md border-b border-steel-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-salvage-500 to-salvage-700 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">Salvager</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-steel-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/resources" className="text-steel-400 hover:text-white transition-colors">
                Resources
              </Link>
              <Link href="/pipelines" className="text-steel-400 hover:text-white transition-colors">
                Pipelines
              </Link>
              <Link href="/auth/login" className="salvage-btn">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-salvage-500/10 border border-salvage-500/20 mb-8">
              <Zap className="w-4 h-4 text-salvage-400" />
              <span className="text-sm text-salvage-400">Resource Gathering Platform</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Gather Data.</span>
              <br />
              <span className="text-gradient-salvage">Supply Intelligence.</span>
            </h1>
            
            <p className="text-xl text-steel-400 mb-10 max-w-2xl mx-auto">
              Connect your applications to vast data sources across the web. 
              Salvager provides a unified interface for gathering, processing, 
              and supplying structured data.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup" className="salvage-btn inline-flex items-center gap-2 px-6 py-3 text-lg">
                Start Gathering
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/docs" className="salvage-btn-secondary inline-flex items-center gap-2 px-6 py-3 text-lg">
                View Documentation
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="salvage-card p-6 text-center">
                <div className="font-display text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-steel-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Complete Resource Management
            </h2>
            <p className="text-steel-400 max-w-2xl mx-auto">
              Everything you need to discover, gather, and supply data to your applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              const isActive = isHovered === feature.id
              
              return (
                <div
                  key={feature.id}
                  className={`salvage-card p-8 cursor-pointer transition-all duration-300 ${
                    isActive ? 'border-glow-salvage scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setIsHovered(feature.id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.color === 'salvage' 
                      ? 'bg-salvage-500/10 text-salvage-400' 
                      : 'bg-rust-500/10 text-rust-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-steel-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 bg-steel-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Seamless Integration
              </h2>
              <p className="text-steel-400 mb-8">
                Salvager connects directly to your existing infrastructure. 
                Use our API to feed data into your applications, databases, 
                or analytics platforms.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Enterprise-grade security' },
                  { icon: Cpu, text: 'RESTful & MCP protocols' },
                  { icon: Database, text: 'Firebase storage integration' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-salvage-500/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-salvage-400" />
                    </div>
                    <span className="text-steel-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="salvage-card p-6 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-steel-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-steel-500">api-example.ts</span>
              </div>
              <pre className="text-steel-300 overflow-x-auto">
{`// Gather resources from any source
const resources = await salvager.gather({
  source: 'social-media',
  query: 'tech startups',
  limit: 100,
  format: 'json'
});

// Supply to your application
await myApp.ingest(resources.data);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Gathering?
          </h2>
          <p className="text-steel-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers using Salvager to power their data-driven applications.
          </p>
          <Link href="/auth/signup" className="salvage-btn inline-flex items-center gap-2 px-8 py-4 text-lg">
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-steel-800/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-salvage-500 to-salvage-700 flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">Salvager</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-steel-500">
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="/api" className="hover:text-white transition-colors">API Reference</Link>
              <Link href="/status" className="hover:text-white transition-colors">Status</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <div className="text-sm text-steel-600">
              © 2024 Salvager. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
