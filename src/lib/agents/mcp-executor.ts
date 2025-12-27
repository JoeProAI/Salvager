/**
 * MCP Agent Executor
 * Connects agents to real MCP tool calls for data extraction
 */

import { apifyMCP } from '../mcp'
import { AgentRole, AGENT_DEFINITIONS } from './types'

export interface MCPToolCall {
  name: string
  arguments: Record<string, any>
}

export interface MCPToolResult {
  tool: string
  success: boolean
  data: any
  error?: string
  executionTime: number
}

export interface AgentTask {
  id: string
  agentRole: AgentRole
  objective: string
  tools: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  results: MCPToolResult[]
  startedAt?: string
  completedAt?: string
}

class MCPAgentExecutor {
  private activeTasks: Map<string, AgentTask> = new Map()

  /**
   * Get available MCP tools
   */
  async getAvailableTools(): Promise<any[]> {
    try {
      return apifyMCP.listTools()
    } catch (error) {
      console.error('[MCPExecutor] Failed to get tools:', error)
      return []
    }
  }

  /**
   * Execute an agent task with MCP tools
   */
  async executeTask(
    agentRole: AgentRole,
    objective: string,
    toolCalls: MCPToolCall[]
  ): Promise<AgentTask> {
    const taskId = this.generateId()
    const agentDef = AGENT_DEFINITIONS[agentRole]

    const task: AgentTask = {
      id: taskId,
      agentRole,
      objective,
      tools: toolCalls.map(t => t.name),
      status: 'running',
      results: [],
      startedAt: new Date().toISOString(),
    }

    this.activeTasks.set(taskId, task)
    console.log(`[${agentDef.name}] Starting task: ${objective}`)

    try {
      for (const toolCall of toolCalls) {
        console.log(`[${agentDef.name}] Calling MCP tool: ${toolCall.name}`)
        const startTime = Date.now()

        try {
          const result = await apifyMCP.callTool(toolCall.name, toolCall.arguments)
          
          task.results.push({
            tool: toolCall.name,
            success: result.success,
            data: result.data,
            executionTime: Date.now() - startTime,
          })

          console.log(`[${agentDef.name}] Tool ${toolCall.name} completed in ${Date.now() - startTime}ms`)
        } catch (error: any) {
          task.results.push({
            tool: toolCall.name,
            success: false,
            data: null,
            error: error.message,
            executionTime: Date.now() - startTime,
          })

          console.error(`[${agentDef.name}] Tool ${toolCall.name} failed:`, error.message)
        }
      }

      task.status = task.results.every(r => r.success) ? 'completed' : 'failed'
      task.completedAt = new Date().toISOString()

      console.log(`[${agentDef.name}] Task ${task.status}: ${task.results.length} tool calls`)
    } catch (error: any) {
      task.status = 'failed'
      task.completedAt = new Date().toISOString()
      console.error(`[${agentDef.name}] Task failed:`, error.message)
    }

    return task
  }

  /**
   * Search for actors using PHANTOM agent
   */
  async searchActors(query: string, limit = 10): Promise<AgentTask> {
    return this.executeTask('phantom', `Search for actors: ${query}`, [
      {
        name: 'search-actors',
        arguments: { search: query, limit },
      },
    ])
  }

  /**
   * Get actor details using BYTE agent
   */
  async getActorDetails(actorId: string): Promise<AgentTask> {
    return this.executeTask('byte', `Fetch actor details: ${actorId}`, [
      {
        name: 'fetch-actor-details',
        arguments: { actorId },
      },
    ])
  }

  /**
   * Run an actor using DAEMON agent
   */
  async runActor(actorId: string, input: Record<string, any>): Promise<AgentTask> {
    return this.executeTask('daemon', `Execute actor: ${actorId}`, [
      {
        name: 'call-actor',
        arguments: { actorId, input },
      },
    ])
  }

  /**
   * Get actor run status using CACHE agent
   */
  async getRunStatus(runId: string): Promise<AgentTask> {
    return this.executeTask('cache', `Check run status: ${runId}`, [
      {
        name: 'get-actor-run',
        arguments: { runId },
      },
    ])
  }

  /**
   * Get actor output using CACHE agent
   */
  async getActorOutput(datasetId: string, limit = 100): Promise<AgentTask> {
    return this.executeTask('cache', `Retrieve output: ${datasetId}`, [
      {
        name: 'get-actor-output',
        arguments: { datasetId, limit },
      },
    ])
  }

  /**
   * Full extraction pipeline using crew
   */
  async runExtractionPipeline(
    query: string,
    extractionParams: Record<string, any>
  ): Promise<{
    searchTask: AgentTask
    detailsTask?: AgentTask
    runTask?: AgentTask
    outputTask?: AgentTask
  }> {
    console.log('[CREW] Starting extraction pipeline')
    console.log(`[CREW] Query: ${query}`)

    // Step 1: PHANTOM searches for actors
    const searchTask = await this.searchActors(query, 5)
    
    if (searchTask.status === 'failed' || !searchTask.results[0]?.data?.length) {
      return { searchTask }
    }

    const actors = searchTask.results[0].data
    const selectedActor = actors[0] // Select first match
    const actorId = selectedActor.id || selectedActor.actorId

    console.log(`[CREW] Selected actor: ${actorId}`)

    // Step 2: BYTE gets actor details
    const detailsTask = await this.getActorDetails(actorId)

    if (detailsTask.status === 'failed') {
      return { searchTask, detailsTask }
    }

    // Step 3: DAEMON runs the actor
    const runTask = await this.runActor(actorId, extractionParams)

    if (runTask.status === 'failed') {
      return { searchTask, detailsTask, runTask }
    }

    const runResult = runTask.results[0]?.data
    const runId = runResult?.runId || runResult?.id

    if (!runId) {
      console.log('[CREW] No run ID returned, extraction may be async')
      return { searchTask, detailsTask, runTask }
    }

    // Step 4: Wait for completion and get output
    // In a real scenario, we'd poll for status
    console.log(`[CREW] Run started: ${runId}`)

    // For now, just return the tasks
    return { searchTask, detailsTask, runTask }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): AgentTask | undefined {
    return this.activeTasks.get(taskId)
  }

  /**
   * Get all active tasks
   */
  getActiveTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values())
      .filter(t => t.status === 'running')
  }
}

export const mcpExecutor = new MCPAgentExecutor()
export default MCPAgentExecutor
