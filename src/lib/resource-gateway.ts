/**
 * Resource Gateway Client
 * Connects to Apify REST API v2 for data extraction
 * https://docs.apify.com/api/v2
 */

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
  private getBaseUrl(): string {
    return 'https://api.apify.com/v2'
  }

  private getToken(): string {
    return process.env.RESOURCE_GATEWAY_TOKEN || ''
  }

  isConfigured(): boolean {
    return !!process.env.RESOURCE_GATEWAY_TOKEN
  }

  /**
   * Make authenticated request to Apify API
   */
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.getBaseUrl()}${endpoint}`
    const token = this.getToken()
    
    console.log(`[Apify] ${options.method || 'GET'} ${endpoint}`)

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
      console.error(`[Apify] Error:`, error)
      throw new Error(`Apify API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Search for Actors in the Apify Store
   */
  async discoverResources(query: string, limit = 20): Promise<ResourceType[]> {
    const result = await this.request(`/store?search=${encodeURIComponent(query)}&limit=${limit}`)
    
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
   * Get Actor details including input schema
   */
  async getResourceDetails(actorId: string): Promise<ResourceType> {
    const result = await this.request(`/acts/${encodeURIComponent(actorId)}`)
    
    // Also get the input schema
    let inputSchema = null
    try {
      const schemaResult = await this.request(`/acts/${encodeURIComponent(actorId)}/input-schema`)
      inputSchema = schemaResult
    } catch (e) {
      // Some actors don't have input schema
    }

    return {
      id: actorId,
      name: result.data?.title || result.data?.name || actorId,
      description: result.data?.description || '',
      category: result.data?.categories?.[0] || 'general',
      inputSchema: inputSchema || result.data?.defaultRunOptions,
    }
  }

  /**
   * Run an Actor with given input
   */
  async startGathering(actorId: string, input: Record<string, any>): Promise<GatheringTask> {
    const result = await this.request(`/acts/${encodeURIComponent(actorId)}/runs`, {
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
   * Get Actor run status
   */
  async getTaskStatus(runId: string): Promise<GatheringTask> {
    const result = await this.request(`/actor-runs/${runId}`)
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
   * Get dataset items (Actor output)
   */
  async getTaskOutput(datasetId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    const limit = options?.limit || 100
    const offset = options?.offset || 0
    const result = await this.request(`/datasets/${datasetId}/items?limit=${limit}&offset=${offset}`)
    return Array.isArray(result) ? result : []
  }

  /**
   * Get Actor run logs
   */
  async getTaskLogs(runId: string): Promise<string> {
    const response = await fetch(`${this.getBaseUrl()}/actor-runs/${runId}/log`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    })
    return response.text()
  }

  /**
   * List user's datasets
   */
  async listStoredResources(): Promise<any[]> {
    const result = await this.request('/datasets')
    return result.data?.items || []
  }

  /**
   * Get dataset metadata
   */
  async getStoredResource(datasetId: string): Promise<any> {
    const result = await this.request(`/datasets/${datasetId}`)
    return result.data
  }

  /**
   * Get dataset items
   */
  async getDatasetItems(datasetId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    return this.getTaskOutput(datasetId, options)
  }

  /**
   * Run RAG Web Browser Actor
   */
  async browseAndGather(query: string, maxResults = 10): Promise<any> {
    return this.startGathering('apify/rag-web-browser', {
      query,
      maxResults,
    })
  }

  /**
   * List key-value stores
   */
  async listKeyValueStores(): Promise<any[]> {
    const result = await this.request('/key-value-stores')
    return result.data?.items || []
  }

  /**
   * Get value from key-value store
   */
  async getStoredValue(storeId: string, key: string): Promise<any> {
    const result = await this.request(`/key-value-stores/${storeId}/records/${key}`)
    return result
  }
}

export const resourceGateway = new ResourceGatewayClient()
export default resourceGateway
