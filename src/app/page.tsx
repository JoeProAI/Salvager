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

  const agents = [
    {
      id: 'phantom',
      icon: Crosshair,
      title: 'PHANTOM',
      description: 'Slips in undetected. Finds what others miss. First in, maps the terrain. Your recon specialist.',
      tag: 'RECON',
    },
    {
      id: 'byte',
      icon: Container,
      title: 'BYTE',
      description: 'Breaks everything into pieces. Parses the unparseable. Data is just bytes waiting to be understood.',
      tag: 'PROCESS',
    },
    {
      id: 'glitch',
      icon: Triangle,
      title: 'GLITCH',
      description: 'Spots what\'s broken. Loves edge cases. If there\'s a flaw in your data or logic, Glitch will find it.',
      tag: 'VALIDATE',
    },
    {
      id: 'daemon',
      icon: Radio,
      title: 'DAEMON',
      description: 'Runs in the background. Synthesizes everything. When the crew finishes, Daemon delivers the payload.',
      tag: 'SYNTHESIZE',
    },
  ]

  const stats = [
    { label: 'RESOURCE TYPES', value: '1,500+', icon: Container },
    { label: 'API CALLS', value: 'LIVE', icon: Zap },
    { label: 'STATUS', value: 'ONLINE', icon: Radio },
    { label: 'LATENCY', value: 'REAL-TIME', icon: Cpu },
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
                <span className="font-display text-2xl text-acid-500 tracking-wider block leading-none">SALVAGE OPS</span>
                <span className="text-[10px] text-slab-500 tracking-[0.3em] uppercase">Agent Crews</span>
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
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-acid-500/30 bg-acid-500/5 mb-8 animate-slide-up opacity-0 stagger-1">
            <Radiation className="w-4 h-4 text-acid-500 animate-pulse" />
            <span className="text-xs text-acid-400 uppercase tracking-[0.2em] font-mono">System Online</span>
          </div>
          
          <h1 className={`font-display text-6xl lg:text-8xl leading-[0.85] mb-8 animate-slide-up opacity-0 stagger-2 ${glitchText ? 'animate-glitch' : ''}`}>
            <span className="text-slab-100 block">GATHER DATA.</span>
            <span className="text-acid-500 neon-text block">SUPPLY POWER.</span>
          </h1>
          
          <p className="text-lg text-slab-400 mb-10 max-w-2xl mx-auto font-mono leading-relaxed animate-slide-up opacity-0 stagger-3">
            <span className="text-acid-600">&gt;</span> Deploy autonomous agent crews to extract data from across the web. 
            Phantom scouts. Byte processes. Daemon delivers.
            <span className="text-acid-400"> Your ops, automated.</span>
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 animate-slide-up opacity-0 stagger-4">
            <Link href="/auth/signup" className="salvage-btn inline-flex items-center gap-3">
              START EXTRACTION
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#crew" className="salvage-btn-secondary inline-flex items-center gap-3">
              MEET THE CREW
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in opacity-0 stagger-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div 
                  key={stat.label} 
                  className="salvage-card p-6 group hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-acid-500/50 group-hover:text-acid-400 transition-colors" />
                  </div>
                  <div className="font-display text-3xl text-acid-400 mb-1 neon-text">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-slab-500 uppercase tracking-[0.15em] font-mono">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* The Crew Section */}
      <section id="crew" className="py-24 px-6 relative scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slab-900/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-4 mb-16">
            <Triangle className="w-6 h-6 text-oxide-500" />
            <h2 className="font-display text-4xl text-slab-100 uppercase tracking-wide">
              The Crew
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slab-700 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {agents.map((agent, index) => {
              const Icon = agent.icon
              const isActive = isHovered === agent.id
              
              return (
                <div
                  key={agent.id}
                  className={`salvage-card p-8 transition-all duration-200 ${
                    isActive ? 'border-acid-500/50' : ''
                  }`}
                  onMouseEnter={() => setIsHovered(agent.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 border-2 border-slab-600 flex items-center justify-center group-hover:border-acid-500 transition-colors">
                      <Icon className={`w-7 h-7 transition-colors ${isActive ? 'text-acid-400' : 'text-slab-400'}`} />
                    </div>
                    <span className={`resource-tag ${isActive ? '' : 'opacity-50'}`}>
                      {agent.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-slab-100 mb-3 tracking-wide">
                    {agent.title}
                  </h3>
                  <p className="text-slab-400 font-mono text-sm leading-relaxed">
                    {agent.description}
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
              <span className="font-display text-lg text-acid-500 tracking-wider">SALVAGE OPS</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-slab-500 font-mono uppercase tracking-wider">
              <Link href="/docs" className="hover:text-acid-400 transition-colors">Docs</Link>
              <Link href="/api" className="hover:text-acid-400 transition-colors">API</Link>
              <Link href="/status" className="hover:text-acid-400 transition-colors">Status</Link>
              <Link href="/privacy" className="hover:text-acid-400 transition-colors">Privacy</Link>
            </div>
            <div className="text-xs text-slab-600 font-mono">
              © 2024 SALVAGE OPS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
