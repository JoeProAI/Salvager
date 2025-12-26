/**
 * Resource Gateway Client
 * Connects to Apify via MCP (Model Context Protocol)
 * https://mcp.apify.com - Full MCP integration for AI agents
 */

import { mcpManager } from './mcp'

export interface ResourceQuery {
  source?: string
  query?: string
  limit?: number
  format?: 'json' | 'csv' | 'xml'
  filters?: Record<string, any>
}

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
  private useMCP = true // Toggle between MCP and REST API
  
  private getToken(): string {
    return process.env.RESOURCE_GATEWAY_TOKEN || ''
  }

  isConfigured(): boolean {
    return !!process.env.RESOURCE_GATEWAY_TOKEN
  }

  /**
   * Get MCP client session
   */
  private async getMCPClient() {
    return mcpManager.getSession('default', this.getToken())
  }

  /**
   * Make authenticated request to Apify REST API (fallback)
   */
  private async restRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `https://api.apify.com/v2${endpoint}`
    const token = this.getToken()
    
    console.log(`[Apify REST] ${options.method || 'GET'} ${endpoint}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[Apify REST] Error:`, error)
      throw new Error(`Apify API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Search for Actors via MCP search-actors tool
   */
  async discoverResources(query: string, limit = 20): Promise<ResourceType[]> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('search-actors', { search: query, limit })
        
        if (Array.isArray(result)) {
          return result.map((actor: any) => ({
            id: actor.id || actor.actorId || `${actor.username}/${actor.name}`,
            name: actor.name || actor.title,
            description: actor.description || '',
            category: actor.categories?.[0] || 'general',
          }))
        }
        return []
      } catch (error) {
        console.error('[MCP] search-actors failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/store?search=${encodeURIComponent(query)}&limit=${limit}`)
    if (result.data?.items) {
      return result.data.items.map((actor: any) => ({
        id: actor.username + '/' + actor.name,
        name: actor.title || actor.name,
        description: actor.description || '',
        category: actor.categories?.[0] || 'general',
      }))
    }
    return []
  }

  /**
   * Get Actor details via MCP fetch-actor-details tool
   */
  async getResourceDetails(actorId: string): Promise<ResourceType> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('fetch-actor-details', { actorId })
        
        return {
          id: result.id || actorId,
          name: result.name || result.title || actorId,
          description: result.description || '',
          category: result.categories?.[0] || 'general',
          inputSchema: result.inputSchema || result.input,
        }
      } catch (error) {
        console.error('[MCP] fetch-actor-details failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/acts/${encodeURIComponent(actorId)}`)
    return {
      id: actorId,
      name: result.data?.title || result.data?.name || actorId,
      description: result.data?.description || '',
      category: result.data?.categories?.[0] || 'general',
      inputSchema: result.data?.defaultRunOptions,
    }
  }

  /**
   * Run an Actor via MCP call-actor tool
   */
  async startGathering(actorId: string, input: Record<string, any>): Promise<GatheringTask> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('call-actor', { actorId, input })
        
        return {
          id: result.runId || result.id || `run-${Date.now()}`,
          status: this.mapStatus(result.status),
          createdAt: result.startedAt || new Date().toISOString(),
          datasetId: result.defaultDatasetId,
          result: result.output,
        }
      } catch (error) {
        console.error('[MCP] call-actor failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/acts/${encodeURIComponent(actorId)}/runs`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    const run = result.data
    return {
      id: run.id,
      status: this.mapStatus(run.status),
      createdAt: run.startedAt || new Date().toISOString(),
      datasetId: run.defaultDatasetId,
    }
  }

  /**
   * Get Actor run status via MCP get-actor-run tool
   */
  async getTaskStatus(runId: string): Promise<GatheringTask> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('get-actor-run', { runId })
        
        return {
          id: result.id || runId,
          status: this.mapStatus(result.status),
          createdAt: result.startedAt || '',
          completedAt: result.finishedAt,
          datasetId: result.defaultDatasetId,
        }
      } catch (error) {
        console.error('[MCP] get-actor-run failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/actor-runs/${runId}`)
    const run = result.data
    return {
      id: run.id,
      status: this.mapStatus(run.status),
      createdAt: run.startedAt || '',
      completedAt: run.finishedAt,
      datasetId: run.defaultDatasetId,
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
   * Get Actor output via MCP get-actor-output tool
   */
  async getTaskOutput(datasetId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('get-actor-output', {
          datasetId,
          limit: options?.limit || 100,
          offset: options?.offset || 0,
        })
        return Array.isArray(result) ? result : result.items || []
      } catch (error) {
        console.error('[MCP] get-actor-output failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const limit = options?.limit || 100
    const offset = options?.offset || 0
    const result = await this.restRequest(`/datasets/${datasetId}/items?limit=${limit}&offset=${offset}`)
    return Array.isArray(result) ? result : []
  }

  /**
   * Get Actor run logs via MCP get-actor-log tool
   */
  async getTaskLogs(runId: string): Promise<string> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('get-actor-log', { runId })
        return typeof result === 'string' ? result : JSON.stringify(result)
      } catch (error) {
        console.error('[MCP] get-actor-log failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/log`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    })
    return response.text()
  }

  /**
   * List datasets via MCP get-dataset-list tool
   */
  async listStoredResources(): Promise<any[]> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('get-dataset-list', {})
        return Array.isArray(result) ? result : result.items || []
      } catch (error) {
        console.error('[MCP] get-dataset-list failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest('/datasets')
    return result.data?.items || []
  }

  /**
   * Get dataset metadata via MCP get-dataset tool
   */
  async getStoredResource(datasetId: string): Promise<any> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        return client.callTool('get-dataset', { datasetId })
      } catch (error) {
        console.error('[MCP] get-dataset failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/datasets/${datasetId}`)
    return result.data
  }

  /**
   * Get dataset items via MCP
   */
  async getDatasetItems(datasetId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    return this.getTaskOutput(datasetId, options)
  }

  /**
   * Use RAG Web Browser via MCP apify-slash-rag-web-browser tool
   */
  async browseAndGather(query: string, maxResults = 10): Promise<any> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        return client.callTool('apify-slash-rag-web-browser', { query, maxResults })
      } catch (error) {
        console.error('[MCP] rag-web-browser failed, falling back to call-actor:', error)
      }
    }

    return this.startGathering('apify/rag-web-browser', { query, maxResults })
  }

  /**
   * List key-value stores via MCP
   */
  async listKeyValueStores(): Promise<any[]> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        const result = await client.callTool('get-key-value-store-list', {})
        return Array.isArray(result) ? result : result.items || []
      } catch (error) {
        console.error('[MCP] get-key-value-store-list failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest('/key-value-stores')
    return result.data?.items || []
  }

  /**
   * Get value from key-value store via MCP
   */
  async getStoredValue(storeId: string, key: string): Promise<any> {
    if (this.useMCP) {
      try {
        const client = await this.getMCPClient()
        return client.callTool('get-key-value-store-record', { storeId, key })
      } catch (error) {
        console.error('[MCP] get-key-value-store-record failed, falling back to REST:', error)
      }
    }

    // Fallback to REST API
    const result = await this.restRequest(`/key-value-stores/${storeId}/records/${key}`)
    return result
  }

  /**
   * Get available MCP tools
   */
  async getAvailableTools(): Promise<any[]> {
    try {
      const client = await this.getMCPClient()
      return client.getTools()
    } catch (error) {
      console.error('[MCP] Failed to get tools:', error)
      return []
    }
  }

  /**
   * Dynamically add an Actor as a tool via MCP add-actor
   */
  async addActorAsTool(actorId: string): Promise<any> {
    try {
      const client = await this.getMCPClient()
      return client.callTool('add-actor', { actorId })
    } catch (error) {
      console.error('[MCP] add-actor failed:', error)
      throw error
    }
  }
}

export const resourceGateway = new ResourceGatewayClient()
export default resourceGateway
