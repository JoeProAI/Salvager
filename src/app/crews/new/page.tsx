'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Skull,
  Plus,
  ArrowLeft,
  Eye,
  Container,
  Triangle,
  Terminal,
  Database,
  Radio,
  ChevronRight,
  Save
} from 'lucide-react'
import { AGENT_DEFINITIONS, AgentRole } from '@/lib/agents'

const AGENT_ICONS: Record<AgentRole, any> = {
  phantom: Eye,
  byte: Container,
  glitch: Triangle,
  root: Terminal,
  cache: Database,
  daemon: Radio,
}

export default function NewCrewPage() {
  const [crewName, setCrewName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<AgentRole[]>([])
  const [workflowType, setWorkflowType] = useState<'sequential' | 'parallel' | 'adversarial'>('sequential')

  const agents = Object.entries(AGENT_DEFINITIONS).map(([agentRole, def]) => ({
    ...def,
    role: agentRole as AgentRole,
  }))

  const toggleAgent = (role: AgentRole) => {
    if (selectedAgents.includes(role)) {
      setSelectedAgents(selectedAgents.filter(r => r !== role))
    } else {
      setSelectedAgents([...selectedAgents, role])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save crew to backend
    console.log({ crewName, description, selectedAgents, workflowType })
  }

  return (
    <div className="min-h-screen bg-slab-950">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <header className="bg-slab-900/95 backdrop-blur-sm border-b-2 border-slab-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/crews" className="p-2 border-2 border-slab-700 hover:border-acid-500 text-slab-400 hover:text-acid-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
                <Skull className="w-5 h-5 text-acid-500" />
              </div>
              <div>
                <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">New Crew</h1>
                <p className="text-sm text-slab-500 font-mono">&gt; Assemble your agent squad</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crew Info */}
          <div className="salvage-card p-6">
            <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Terminal className="w-5 h-5 text-acid-400" />
              Crew Identity
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Crew Name</label>
                <input
                  type="text"
                  value={crewName}
                  onChange={(e) => setCrewName(e.target.value)}
                  className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                  placeholder="> Enter crew identifier"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600 min-h-[100px]"
                  placeholder="> Describe the crew's mission"
                />
              </div>
            </div>
          </div>

          {/* Agent Selection */}
          <div className="salvage-card p-6">
            <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Plus className="w-5 h-5 text-acid-400" />
              Select Agents
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {agents.map((agent) => {
                const Icon = AGENT_ICONS[agent.role]
                const isSelected = selectedAgents.includes(agent.role)
                
                return (
                  <button
                    key={agent.role}
                    type="button"
                    onClick={() => toggleAgent(agent.role)}
                    className={`p-4 border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-acid-500 bg-acid-500/10' 
                        : 'border-slab-700 hover:border-slab-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 border-2 flex items-center justify-center ${
                        isSelected ? 'border-acid-500 text-acid-400' : 'border-slab-600 text-slab-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-display uppercase tracking-wide ${
                          isSelected ? 'text-acid-400' : 'text-slab-100'
                        }`}>
                          {agent.name}
                        </div>
                        <div className="text-xs text-slab-500 font-mono mt-1">
                          {agent.personality.slice(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {selectedAgents.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-slab-800">
                <div className="text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">Selected Squad</div>
                <div className="flex items-center gap-2">
                  {selectedAgents.map((role, i) => {
                    const Icon = AGENT_ICONS[role]
                    return (
                      <div key={role} className="flex items-center">
                        <div className="w-8 h-8 border-2 border-acid-500 flex items-center justify-center text-acid-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        {i < selectedAgents.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-slab-600 mx-1" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Workflow Type */}
          <div className="salvage-card p-6">
            <h2 className="font-display text-lg text-slab-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Radio className="w-5 h-5 text-acid-400" />
              Workflow Type
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {(['sequential', 'parallel', 'adversarial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkflowType(type)}
                  className={`p-4 border-2 text-left transition-all ${
                    workflowType === type 
                      ? 'border-acid-500 bg-acid-500/10' 
                      : 'border-slab-700 hover:border-slab-600'
                  }`}
                >
                  <div className={`font-display uppercase tracking-wide mb-1 ${
                    workflowType === type ? 'text-acid-400' : 'text-slab-100'
                  }`}>
                    {type}
                  </div>
                  <div className="text-xs text-slab-500 font-mono">
                    {type === 'sequential' && 'Agents work in order'}
                    {type === 'parallel' && 'Agents work simultaneously'}
                    {type === 'adversarial' && 'Agents debate & refine'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/crews" className="salvage-btn-secondary">
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={!crewName || selectedAgents.length === 0}
              className="salvage-btn inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              CREATE CREW
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
