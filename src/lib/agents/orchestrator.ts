/**
 * SALVAGE OPS - Crew Orchestrator
 * Coordinates agent crews for complex operations
 */

import { 
  AgentRole, 
  AgentMessage, 
  Crew, 
  CrewWorkflow, 
  AGENT_DEFINITIONS,
  ToolCall 
} from './types'

export interface OrchestratorConfig {
  maxConcurrentAgents: number
  defaultTimeout: number
  enableLogging: boolean
}

export interface OperationContext {
  operationId: string
  objective: string
  inputs: Record<string, any>
  messages: AgentMessage[]
  artifacts: Record<string, any>
  startedAt: string
  status: 'running' | 'completed' | 'failed'
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  maxConcurrentAgents: 3,
  defaultTimeout: 30000,
  enableLogging: true,
}

class CrewOrchestrator {
  private config: OrchestratorConfig
  private activeOperations: Map<string, OperationContext> = new Map()

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async runCrew(
    crew: Crew,
    objective: string,
    inputs: Record<string, any> = {}
  ): Promise<OperationContext> {
    const operationId = this.generateId()
    
    const context: OperationContext = {
      operationId,
      objective,
      inputs,
      messages: [],
      artifacts: {},
      startedAt: new Date().toISOString(),
      status: 'running',
    }

    this.activeOperations.set(operationId, context)
    this.log(`[ORCHESTRATOR] Starting operation ${operationId}`)
    this.log(`[ORCHESTRATOR] Objective: ${objective}`)
    this.log(`[ORCHESTRATOR] Crew: ${crew.name} (${crew.agents.join(', ')})`)

    try {
      switch (crew.workflow.type) {
        case 'sequential':
          await this.runSequential(crew, context)
          break
        case 'parallel':
          await this.runParallel(crew, context)
          break
        case 'adversarial':
          await this.runAdversarial(crew, context)
          break
      }

      context.status = 'completed'
      this.log(`[ORCHESTRATOR] Operation ${operationId} completed`)
    } catch (error) {
      context.status = 'failed'
      this.log(`[ORCHESTRATOR] Operation ${operationId} failed: ${error}`)
      throw error
    }

    return context
  }

  private async runSequential(crew: Crew, context: OperationContext): Promise<void> {
    for (const step of crew.workflow.steps) {
      this.log(`[${step.agent.toUpperCase()}] Starting: ${step.action}`)
      
      const message = await this.invokeAgent(
        step.agent,
        step.action,
        context
      )
      
      context.messages.push(message)
      this.log(`[${step.agent.toUpperCase()}] ${message.content.slice(0, 100)}...`)
    }
  }

  private async runParallel(crew: Crew, context: OperationContext): Promise<void> {
    const promises = crew.workflow.steps.map(step => 
      this.invokeAgent(step.agent, step.action, context)
    )

    const messages = await Promise.all(promises)
    context.messages.push(...messages)
  }

  private async runAdversarial(crew: Crew, context: OperationContext): Promise<void> {
    // Run initial steps sequentially
    const analysisSteps = crew.workflow.steps.filter(s => 
      ['discover', 'parse', 'contextualize'].includes(s.action)
    )
    
    for (const step of analysisSteps) {
      const message = await this.invokeAgent(step.agent, step.action, context)
      context.messages.push(message)
    }

    // Run challenge/validation step
    const challengeStep = crew.workflow.steps.find(s => s.action === 'challenge')
    if (challengeStep) {
      const challengeMessage = await this.invokeAgent(
        challengeStep.agent,
        challengeStep.action,
        context,
        { adversarial: true }
      )
      context.messages.push(challengeMessage)

      // If challenge found issues, re-run analysis
      if (challengeMessage.confidence && challengeMessage.confidence < 0.7) {
        this.log(`[ORCHESTRATOR] Challenge raised concerns, re-analyzing...`)
        // Could trigger re-analysis here
      }
    }

    // Final synthesis and execution
    const finalSteps = crew.workflow.steps.filter(s => 
      ['synthesize', 'execute'].includes(s.action)
    )
    
    for (const step of finalSteps) {
      const message = await this.invokeAgent(step.agent, step.action, context)
      context.messages.push(message)
    }
  }

  private async invokeAgent(
    role: AgentRole,
    action: string,
    context: OperationContext,
    options: { adversarial?: boolean } = {}
  ): Promise<AgentMessage> {
    const agentDef = AGENT_DEFINITIONS[role]
    
    // Build context from previous messages
    const previousContext = context.messages
      .map(m => `[${m.agentRole.toUpperCase()}]: ${m.content}`)
      .join('\n\n')

    const prompt = this.buildPrompt(agentDef, action, context.objective, previousContext, options)

    // This is where we'd call the actual LLM API
    // For now, return a placeholder that shows the structure
    const message: AgentMessage = {
      id: this.generateId(),
      agentRole: role,
      content: `[${agentDef.name}] Processing: ${action} for objective "${context.objective}"`,
      reasoning: `Using ${agentDef.model} model with ${action} capability`,
      confidence: 0.85,
      timestamp: new Date().toISOString(),
    }

    return message
  }

  private buildPrompt(
    agentDef: typeof AGENT_DEFINITIONS[AgentRole],
    action: string,
    objective: string,
    previousContext: string,
    options: { adversarial?: boolean }
  ): string {
    let prompt = `${agentDef.systemPrompt}\n\n`
    prompt += `OBJECTIVE: ${objective}\n\n`
    prompt += `ACTION: ${action}\n\n`
    
    if (previousContext) {
      prompt += `PREVIOUS CREW COMMUNICATIONS:\n${previousContext}\n\n`
    }

    if (options.adversarial) {
      prompt += `MODE: ADVERSARIAL - Your job is to find flaws and challenge the conclusions above.\n\n`
    }

    prompt += `Respond with your analysis. Be concise but thorough.`

    return prompt
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  private log(message: string): void {
    if (this.config.enableLogging) {
      console.log(message)
    }
  }

  getOperation(operationId: string): OperationContext | undefined {
    return this.activeOperations.get(operationId)
  }

  getActiveOperations(): OperationContext[] {
    return Array.from(this.activeOperations.values())
      .filter(op => op.status === 'running')
  }
}

export const orchestrator = new CrewOrchestrator()
export default CrewOrchestrator
