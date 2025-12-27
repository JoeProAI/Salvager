/**
 * Resource Gateway Client
 * Pure MCP integration - agents orchestrate all Apify tool calls
 * https://mcp.apify.com
 */

import { apifyMCP } from './mcp'

export interface GatheringTask {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress?: number
  result?: any
  error?: string
  createdAt: string
  completedAt?: string
  datasetId?: string
}

export interface ResourceType {
  id: string
  name: string
  description: string
  category: string
  inputSchema?: Record<string, any>
}

class ResourceGatewayClient {
  isConfigured(): boolean {
    return apifyMCP.isConfigured()
  }

  /**
   * Search for Actors via MCP search-actors tool
   */
  async discoverResources(query: string, limit = 20): Promise<ResourceType[]> {
    const actors = await apifyMCP.searchActors(query, limit)
    return actors.map(actor => ({
      id: actor.id,
      name: actor.title || actor.name,
      description: actor.description,
      category: actor.categories?.[0] || 'general',
    }))
  }

  /**
   * Get Actor details via MCP fetch-actor-details tool
   */
  async getResourceDetails(actorId: string): Promise<ResourceType | null> {
    const details = await apifyMCP.getActorDetails(actorId)
    if (!details) return null
    
    return {
      id: details.id || actorId,
      name: details.title || details.name || actorId,
      description: details.description || '',
      category: details.categories?.[0] || 'general',
      inputSchema: details.inputSchema || details.input,
    }
  }

  /**
   * Run an Actor via MCP call-actor tool
   */
  async startGathering(actorId: string, input: Record<string, any>): Promise<GatheringTask> {
    const result = await apifyMCP.runActor(actorId, input)
    
    if (!result.success) {
      return {
        id: `error-${Date.now()}`,
        status: 'failed',
        error: result.error,
        createdAt: new Date().toISOString(),
      }
    }

    const data = result.data || {}
    return {
      id: data.runId || data.id || `run-${Date.now()}`,
      status: this.mapStatus(data.status),
      createdAt: data.startedAt || new Date().toISOString(),
      datasetId: data.defaultDatasetId,
      result: data.output,
    }
  }

  /**
   * Get Actor run status via MCP
   */
  async getTaskStatus(runId: string): Promise<GatheringTask> {
    const status = await apifyMCP.getRunStatus(runId)
    
    if (!status) {
      return {
        id: runId,
        status: 'pending',
        createdAt: '',
      }
    }

    return {
      id: status.id || runId,
      status: this.mapStatus(status.status),
      createdAt: status.startedAt || '',
      completedAt: status.finishedAt,
      datasetId: status.defaultDatasetId,
    }
  }

  /**
   * Map Apify status to our status
   */
  private mapStatus(status: string): 'pending' | 'running' | 'completed' | 'failed' {
    switch (status) {
      case 'SUCCEEDED': return 'completed'
      case 'FAILED': case 'ABORTED': case 'TIMED-OUT': return 'failed'
      case 'RUNNING': return 'running'
      default: return 'pending'
    }
  }

  /**
   * Get Actor output via MCP
   */
  async getTaskOutput(datasetId: string, options?: { limit?: number }): Promise<any[]> {
    return apifyMCP.getActorOutput(datasetId, options?.limit || 100)
  }

  /**
   * Get available MCP tools
   */
  async getAvailableTools(): Promise<any[]> {
    return apifyMCP.listTools()
  }

  /**
   * Call any MCP tool directly
   */
  async callTool(toolName: string, args: Record<string, any> = {}): Promise<any> {
    return apifyMCP.callTool(toolName, args)
  }
}

export const resourceGateway = new ResourceGatewayClient()
export default resourceGateway
