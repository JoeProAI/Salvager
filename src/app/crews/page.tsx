'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Skull,
  Crosshair,
  Radio,
  Container,
  Triangle,
  Zap,
  Eye,
  Terminal,
  Shield,
  Database,
  Play,
  Users,
  ChevronRight,
  Plus
} from 'lucide-react'
import { AGENT_DEFINITIONS, CREW_TEMPLATES, AgentRole } from '@/lib/agents'

const AGENT_ICONS: Record<AgentRole, any> = {
  phantom: Eye,
  byte: Container,
  glitch: Triangle,
  root: Terminal,
  cache: Database,
  daemon: Radio,
}

export default function CrewsPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null)
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null)

  const agents = Object.entries(AGENT_DEFINITIONS).map(([agentRole, def]) => ({
    ...def,
    role: agentRole as AgentRole,
  }))

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
              <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Crews</h1>
            </div>
            <Link href="/dashboard" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
              Command
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Agents Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Users className="w-6 h-6 text-acid-500" />
            <h2 className="font-display text-2xl text-slab-100 uppercase tracking-wide">Agent Roster</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slab-700 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = AGENT_ICONS[agent.role]
              const isSelected = selectedAgent === agent.role
              
              return (
                <div
                  key={agent.role}
                  onClick={() => setSelectedAgent(isSelected ? null : agent.role)}
                  className={`salvage-card p-6 cursor-pointer transition-all ${
                    isSelected ? 'border-acid-500/50' : 'hover:border-slab-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-acid-500 text-acid-400' : 'border-slab-600 text-slab-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs px-2 py-1 font-mono uppercase tracking-wider ${
                      isSelected ? 'bg-acid-500/20 text-acid-400' : 'bg-slab-800 text-slab-500'
                    }`}>
                      {agent.model}
                    </span>
                  </div>
                  
                  <h3 className={`font-display text-xl mb-2 uppercase tracking-wide transition-colors ${
                    isSelected ? 'text-acid-400' : 'text-slab-100'
                  }`}>
                    {agent.name}
                  </h3>
                  
                  <p className="text-slab-400 font-mono text-sm mb-4">
                    {agent.personality}
                  </p>

                  {isSelected && (
                    <div className="pt-4 border-t-2 border-slab-800 animate-fade-in">
                      <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Capabilities</div>
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.map((cap) => (
                          <span key={cap} className="text-xs px-2 py-1 bg-slab-800 text-acid-400 font-mono">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Crew Templates Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Zap className="w-6 h-6 text-oxide-500" />
            <h2 className="font-display text-2xl text-slab-100 uppercase tracking-wide">Crew Templates</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slab-700 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CREW_TEMPLATES.map((crew) => {
              const isSelected = selectedCrew === crew.name
              
              return (
                <div
                  key={crew.name}
                  className={`salvage-card p-6 transition-all ${
                    isSelected ? 'border-acid-500/50' : 'hover:border-slab-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-xl text-slab-100 uppercase tracking-wide mb-1">
                        {crew.name}
                      </h3>
                      <p className="text-slab-400 font-mono text-sm">
                        {crew.description}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 font-mono uppercase tracking-wider ${
                      crew.workflow.type === 'adversarial' ? 'bg-oxide-500/20 text-oxide-400' :
                      crew.workflow.type === 'parallel' ? 'bg-acid-500/20 text-acid-400' :
                      'bg-slab-800 text-slab-500'
                    }`}>
                      {crew.workflow.type}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-3">Squad</div>
                    <div className="flex items-center gap-2">
                      {crew.agents.map((agentRole, i) => {
                        const Icon = AGENT_ICONS[agentRole]
                        return (
                          <div key={agentRole} className="flex items-center">
                            <div className="w-8 h-8 border-2 border-slab-600 flex items-center justify-center hover:border-acid-500 hover:text-acid-400 transition-colors text-slab-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            {i < crew.agents.length - 1 && (
                              <ChevronRight className="w-4 h-4 text-slab-600 mx-1" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/gather/new?crew=${crew.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="salvage-btn inline-flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      DEPLOY
                    </Link>
                    <button
                      onClick={() => setSelectedCrew(isSelected ? null : crew.name)}
                      className="text-slab-400 hover:text-acid-400 transition-colors font-mono text-sm uppercase tracking-wider"
                    >
                      {isSelected ? 'Hide Details' : 'View Workflow'}
                    </button>
                  </div>

                  {isSelected && (
                    <div className="mt-6 pt-4 border-t-2 border-slab-800 animate-fade-in">
                      <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-3">Workflow Steps</div>
                      <div className="space-y-2">
                        {crew.workflow.steps.map((step, i) => {
                          const Icon = AGENT_ICONS[step.agent]
                          return (
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <span className="text-slab-600 font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                              <div className="w-6 h-6 border border-slab-700 flex items-center justify-center">
                                <Icon className="w-3 h-3 text-slab-400" />
                              </div>
                              <span className="text-slab-400 font-mono uppercase">{step.agent}</span>
                              <ChevronRight className="w-3 h-3 text-slab-600" />
                              <span className="text-acid-400 font-mono">{step.action}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Custom Crew CTA */}
          <div className="mt-8 salvage-card p-8 text-center border-dashed">
            <Shield className="w-12 h-12 text-slab-600 mx-auto mb-4" />
            <h3 className="font-display text-xl text-slab-100 uppercase tracking-wide mb-2">
              Build Custom Crew
            </h3>
            <p className="text-slab-500 font-mono text-sm mb-6 max-w-md mx-auto">
              Assemble your own agent squad with custom workflows and specialized capabilities.
            </p>
            <Link href="/crews/new" className="salvage-btn-secondary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              CREATE CREW
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
