'use client'

import { useState, useEffect } from 'react'
import { 
  Skull,
  Crosshair, 
  Zap, 
  Container, 
  ArrowRight, 
  Layers,
  Radio,
  ShieldAlert,
  Cpu,
  Triangle,
  Radiation
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [glitchText, setGlitchText] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 150)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      id: 'discover',
      icon: Crosshair,
      title: 'LOCATE RESOURCES',
      description: 'Scan and catalog data deposits across platforms. Social feeds. Commerce hubs. Map coordinates. Nothing escapes detection.',
      tag: 'SCAN',
    },
    {
      id: 'gather',
      icon: Container,
      title: 'EXTRACT DATA',
      description: 'Pull structured payloads from any web source. Intelligent parsing. Automatic validation. Zero waste.',
      tag: 'EXTRACT',
    },
    {
      id: 'pipeline',
      icon: Layers,
      title: 'AUTOMATE FLOWS',
      description: 'Build pipelines that run on schedule. Gather. Transform. Deliver. Repeat. No human intervention required.',
      tag: 'AUTOMATE',
    },
    {
      id: 'monitor',
      icon: Radio,
      title: 'TRACK OPERATIONS',
      description: 'Real-time status feeds. Live logs. Performance metrics. Know exactly what your salvage operations are doing.',
      tag: 'MONITOR',
    },
  ]

  const stats = [
    { label: 'RESOURCE TYPES', value: '8K+', icon: Container },
    { label: 'DAILY EXTRACTS', value: '10M+', icon: Zap },
    { label: 'UPTIME', value: '99.9%', icon: Radio },
    { label: 'RESPONSE', value: '<2s', icon: Cpu },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b-2 border-slab-800 bg-slab-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 border-2 border-acid-500 flex items-center justify-center relative overflow-hidden">
                <Skull className="w-6 h-6 text-acid-500 relative z-10" />
                <div className="absolute inset-0 bg-acid-500/10 group-hover:bg-acid-500/20 transition-colors" />
              </div>
              <div>
                <span className="font-display text-2xl text-acid-500 tracking-wider block leading-none">SALVAGER</span>
                <span className="text-[10px] text-slab-500 tracking-[0.3em] uppercase">Resource Extraction</span>
              </div>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
                Dashboard
              </Link>
              <Link href="/resources" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
                Resources
              </Link>
              <Link href="/auth/login" className="salvage-btn">
                ENTER YARD
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative">
        {/* Diagonal hazard stripe */}
        <div className="absolute top-24 left-0 right-0 h-8 hazard-stripe opacity-30" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-acid-500/30 bg-acid-500/5 mb-8 animate-slide-up opacity-0 stagger-1">
                <Radiation className="w-4 h-4 text-acid-500 animate-pulse" />
                <span className="text-xs text-acid-400 uppercase tracking-[0.2em] font-mono">System Online</span>
              </div>
              
              <h1 className={`font-display text-6xl lg:text-8xl leading-[0.85] mb-8 animate-slide-up opacity-0 stagger-2 ${glitchText ? 'animate-glitch' : ''}`}>
                <span className="text-slab-100 block">GATHER</span>
                <span className="text-slab-100 block">DATA.</span>
                <span className="text-acid-500 neon-text block">SUPPLY</span>
                <span className="text-acid-500 neon-text block">POWER.</span>
              </h1>
              
              <p className="text-lg text-slab-400 mb-10 max-w-lg font-mono leading-relaxed animate-slide-up opacity-0 stagger-3">
                <span className="text-acid-600">&gt;</span> Connect to vast data deposits across the web. 
                Extract. Process. Deliver. Your applications need fuel. 
                <span className="text-acid-400"> We supply it.</span>
              </p>

              <div className="flex items-center gap-4 animate-slide-up opacity-0 stagger-4">
                <Link href="/auth/signup" className="salvage-btn inline-flex items-center gap-3">
                  START EXTRACTION
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/resources" className="salvage-btn-secondary inline-flex items-center gap-3">
                  BROWSE RESOURCES
                </Link>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in opacity-0 stagger-5">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div 
                    key={stat.label} 
                    className="salvage-card p-6 group hover:scale-105 transition-transform duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-5 h-5 text-acid-500/50 group-hover:text-acid-400 transition-colors" />
                      <span className="text-[10px] text-slab-600 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="font-display text-4xl text-acid-400 mb-1 neon-text">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-slab-500 uppercase tracking-[0.15em] font-mono">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slab-900/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-4 mb-16">
            <Triangle className="w-6 h-6 text-oxide-500" />
            <h2 className="font-display text-4xl text-slab-100 uppercase tracking-wide">
              Capabilities
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slab-700 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = isHovered === feature.id
              
              return (
                <div
                  key={feature.id}
                  className={`salvage-card p-8 transition-all duration-200 ${
                    isActive ? 'border-acid-500/50' : ''
                  }`}
                  onMouseEnter={() => setIsHovered(feature.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 border-2 border-slab-600 flex items-center justify-center group-hover:border-acid-500 transition-colors">
                      <Icon className={`w-7 h-7 transition-colors ${isActive ? 'text-acid-400' : 'text-slab-400'}`} />
                    </div>
                    <span className={`resource-tag ${isActive ? '' : 'opacity-50'}`}>
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-slab-100 mb-3 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-slab-400 font-mono text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-oxide-500" />
                <span className="text-xs text-oxide-400 uppercase tracking-[0.2em] font-mono">Integration Protocol</span>
              </div>
              
              <h2 className="font-display text-4xl lg:text-5xl text-slab-100 mb-6 leading-tight">
                PLUG INTO<br />
                <span className="text-acid-500">YOUR STACK</span>
              </h2>
              
              <p className="text-slab-400 mb-8 font-mono leading-relaxed">
                Direct API access. RESTful endpoints. MCP protocol support. 
                Feed extracted data straight into your applications, databases, 
                or analytics platforms. No middleware. No friction.
              </p>
              
              <div className="space-y-4">
                {[
                  { text: 'Enterprise-grade encryption', status: 'ACTIVE' },
                  { text: 'RESTful & MCP protocols', status: 'READY' },
                  { text: 'Firebase integration', status: 'LINKED' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slab-800">
                    <span className="text-slab-300 font-mono text-sm">{item.text}</span>
                    <span className="resource-tag text-[10px]">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="salvage-card overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b-2 border-slab-700 bg-slab-900">
                <div className="w-3 h-3 bg-oxide-500" />
                <div className="w-3 h-3 bg-hazard-500" />
                <div className="w-3 h-3 bg-acid-500" />
                <span className="ml-4 text-slab-500 font-mono text-xs uppercase tracking-wider">salvage.ts</span>
              </div>
              <pre className="p-6 text-sm font-mono overflow-x-auto">
                <code>
                  <span className="text-slab-500">{'// Extract resources from any source'}</span>{'\n'}
                  <span className="text-oxide-400">const</span> <span className="text-slab-200">payload</span> <span className="text-slab-500">=</span> <span className="text-oxide-400">await</span> <span className="text-acid-400">salvager</span><span className="text-slab-500">.</span><span className="text-slab-200">extract</span><span className="text-slab-500">{'({'}</span>{'\n'}
                  {'  '}<span className="text-acid-400">source</span><span className="text-slab-500">:</span> <span className="text-oxide-300">'social-feeds'</span><span className="text-slab-500">,</span>{'\n'}
                  {'  '}<span className="text-acid-400">query</span><span className="text-slab-500">:</span> <span className="text-oxide-300">'tech startups 2024'</span><span className="text-slab-500">,</span>{'\n'}
                  {'  '}<span className="text-acid-400">limit</span><span className="text-slab-500">:</span> <span className="text-hazard-400">100</span><span className="text-slab-500">,</span>{'\n'}
                  {'  '}<span className="text-acid-400">format</span><span className="text-slab-500">:</span> <span className="text-oxide-300">'json'</span>{'\n'}
                  <span className="text-slab-500">{'});'}</span>{'\n\n'}
                  <span className="text-slab-500">{'// Feed to your application'}</span>{'\n'}
                  <span className="text-oxide-400">await</span> <span className="text-acid-400">myApp</span><span className="text-slab-500">.</span><span className="text-slab-200">ingest</span><span className="text-slab-500">(</span><span className="text-slab-200">payload</span><span className="text-slab-500">.</span><span className="text-acid-400">data</span><span className="text-slab-500">);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 hazard-stripe opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-block mb-8">
            <Skull className="w-16 h-16 text-acid-500 mx-auto animate-float" />
          </div>
          
          <h2 className="font-display text-4xl lg:text-6xl text-slab-100 mb-6">
            READY TO<br />
            <span className="text-acid-500 neon-text">START SALVAGING?</span>
          </h2>
          
          <p className="text-slab-400 mb-10 font-mono max-w-xl mx-auto">
            Join the extraction network. Power your applications with 
            continuous data streams from across the web.
          </p>
          
          <Link href="/auth/signup" className="salvage-btn inline-flex items-center gap-3 text-lg">
            CREATE ACCOUNT
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-slab-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-acid-500/50 flex items-center justify-center">
                <Skull className="w-5 h-5 text-acid-500" />
              </div>
              <span className="font-display text-lg text-acid-500 tracking-wider">SALVAGER</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-slab-500 font-mono uppercase tracking-wider">
              <Link href="/docs" className="hover:text-acid-400 transition-colors">Docs</Link>
              <Link href="/api" className="hover:text-acid-400 transition-colors">API</Link>
              <Link href="/status" className="hover:text-acid-400 transition-colors">Status</Link>
              <Link href="/privacy" className="hover:text-acid-400 transition-colors">Privacy</Link>
            </div>
            <div className="text-xs text-slab-600 font-mono">
              © 2024 SALVAGER SYSTEMS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
