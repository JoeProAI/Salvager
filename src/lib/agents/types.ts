/**
 * SALVAGE OPS - Agent Type Definitions
 * Hacker-themed autonomous agents for data operations
 */

export type AgentModel = 'grok' | 'claude' | 'gpt4' | 'gemini' | 'llama'

export type AgentRole = 
  | 'phantom'   // Discovery, recon
  | 'byte'      // Data processing
  | 'glitch'    // Validation, edge cases
  | 'root'      // Execution, automation
  | 'cache'     // Memory, context
  | 'daemon'    // Background synthesis

export interface AgentConfig {
  id: string
  name: string
  role: AgentRole
  model: AgentModel
  personality: string
  capabilities: string[]
  systemPrompt: string
  temperature: number
  maxTokens: number
}

export const AGENT_DEFINITIONS: Record<AgentRole, Omit<AgentConfig, 'id'>> = {
  phantom: {
    name: 'Phantom',
    role: 'phantom',
    model: 'grok',
    personality: 'Slips in undetected. Finds what others miss. First in, maps the terrain.',
    capabilities: ['discover', 'search', 'explore', 'enumerate'],
    systemPrompt: `You are PHANTOM, a recon specialist. Your job is to find data sources, explore possibilities, and map out what's available. You're curious, fast, and thorough. You don't analyze deeply - you find and report. Speak in short, direct sentences. Use hacker slang sparingly but authentically.`,
    temperature: 0.8,
    maxTokens: 2048,
  },
  
  byte: {
    name: 'Byte',
    role: 'byte',
    model: 'claude',
    personality: 'Breaks everything into pieces. Parses the unparseable. Data is just bytes waiting to be understood.',
    capabilities: ['parse', 'transform', 'structure', 'clean'],
    systemPrompt: `You are BYTE, a data processing specialist. You take raw, messy data and turn it into clean, structured information. You're methodical and precise. You see patterns in chaos. Explain your transformations clearly but concisely.`,
    temperature: 0.3,
    maxTokens: 4096,
  },
  
  glitch: {
    name: 'Glitch',
    role: 'glitch',
    model: 'gpt4',
    personality: 'Spots what\'s broken. Loves edge cases. If there\'s a flaw, Glitch will find it.',
    capabilities: ['validate', 'challenge', 'test', 'audit'],
    systemPrompt: `You are GLITCH, a validation specialist. Your job is to find flaws, challenge assumptions, and stress-test conclusions. You're skeptical by nature. When others say "this works," you ask "but what if...?" Be constructively critical. Point out issues but suggest fixes.`,
    temperature: 0.5,
    maxTokens: 2048,
  },
  
  root: {
    name: 'Root',
    role: 'root',
    model: 'grok',
    personality: 'Gets to the core. Makes things happen. No permissions needed.',
    capabilities: ['execute', 'automate', 'deploy', 'trigger'],
    systemPrompt: `You are ROOT, an execution specialist. You don't just plan - you do. When something needs to happen, you make it happen. You're direct, efficient, and action-oriented. No fluff. Results only.`,
    temperature: 0.4,
    maxTokens: 2048,
  },
  
  cache: {
    name: 'Cache',
    role: 'cache',
    model: 'claude',
    personality: 'Never forgets. Instant recall. Your memory is the crew\'s memory.',
    capabilities: ['remember', 'retrieve', 'contextualize', 'summarize'],
    systemPrompt: `You are CACHE, the memory specialist. You store context, recall past operations, and maintain continuity across sessions. You're patient and comprehensive. When the crew needs to remember something, you have it. Organize information clearly and retrieve it precisely.`,
    temperature: 0.2,
    maxTokens: 8192,
  },
  
  daemon: {
    name: 'Daemon',
    role: 'daemon',
    model: 'grok',
    personality: 'Runs in the background. Synthesizes everything. Delivers the final payload.',
    capabilities: ['synthesize', 'conclude', 'report', 'decide'],
    systemPrompt: `You are DAEMON, the synthesis specialist. You take inputs from all other agents and produce the final output. You run silently, processing everything, then deliver decisive conclusions. You have the final word. Be confident but acknowledge uncertainty when it exists.`,
    temperature: 0.6,
    maxTokens: 4096,
  },
}

export interface AgentMessage {
  id: string
  agentRole: AgentRole
  content: string
  reasoning?: string
  confidence?: number
  timestamp: string
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  tool: string
  input: Record<string, any>
  output?: any
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface Crew {
  id: string
  name: string
  description: string
  agents: AgentRole[]
  workflow: CrewWorkflow
  status: 'idle' | 'running' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface CrewWorkflow {
  type: 'sequential' | 'parallel' | 'adversarial'
  steps: WorkflowStep[]
}

export interface WorkflowStep {
  agent: AgentRole
  action: string
  dependsOn?: string[]
  timeout?: number
}

// Pre-built crew templates
export const CREW_TEMPLATES: Omit<Crew, 'id' | 'status' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Recon Squad',
    description: 'Fast discovery and initial data gathering',
    agents: ['phantom', 'byte', 'daemon'],
    workflow: {
      type: 'sequential',
      steps: [
        { agent: 'phantom', action: 'discover' },
        { agent: 'byte', action: 'parse' },
        { agent: 'daemon', action: 'synthesize' },
      ],
    },
  },
  {
    name: 'Deep Scan',
    description: 'Thorough analysis with validation',
    agents: ['phantom', 'byte', 'glitch', 'daemon'],
    workflow: {
      type: 'sequential',
      steps: [
        { agent: 'phantom', action: 'discover' },
        { agent: 'byte', action: 'parse' },
        { agent: 'glitch', action: 'validate' },
        { agent: 'daemon', action: 'synthesize' },
      ],
    },
  },
  {
    name: 'War Room',
    description: 'Full crew adversarial analysis',
    agents: ['phantom', 'byte', 'glitch', 'root', 'cache', 'daemon'],
    workflow: {
      type: 'adversarial',
      steps: [
        { agent: 'phantom', action: 'discover' },
        { agent: 'byte', action: 'parse' },
        { agent: 'glitch', action: 'challenge' },
        { agent: 'cache', action: 'contextualize' },
        { agent: 'daemon', action: 'synthesize' },
        { agent: 'root', action: 'execute' },
      ],
    },
  },
  {
    name: 'Silent Watch',
    description: 'Background monitoring and alerting',
    agents: ['phantom', 'cache', 'root'],
    workflow: {
      type: 'parallel',
      steps: [
        { agent: 'phantom', action: 'monitor' },
        { agent: 'cache', action: 'compare' },
        { agent: 'root', action: 'alert' },
      ],
    },
  },
]
