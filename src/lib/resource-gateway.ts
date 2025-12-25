/**
 * Resource Gateway Client
 * Connects to the data gathering infrastructure via MCP protocol
 */

const GATEWAY_URL = process.env.RESOURCE_GATEWAY_URL || 'https://mcp.apify.com'
const GATEWAY_TOKEN = process.env.RESOURCE_GATEWAY_TOKEN

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
}

export interface ResourceType {
  id: string
  name: string
  description: string
  category: string
  inputSchema?: Record<string, any>
}

class ResourceGatewayClient {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = GATEWAY_URL
    this.token = GATEWAY_TOKEN || ''
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gateway request failed: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Search for available resource types
   */
  async discoverResources(query: string, limit = 20): Promise<ResourceType[]> {
    return this.request('/tools/search-actors', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    })
  }

  /**
   * Get details about a specific resource type
   */
  async getResourceDetails(resourceId: string): Promise<ResourceType> {
    return this.request('/tools/fetch-actor-details', {
      method: 'POST',
      body: JSON.stringify({ actorId: resourceId }),
    })
  }

  /**
   * Start a resource gathering task
   */
  async startGathering(resourceId: string, input: Record<string, any>): Promise<GatheringTask> {
    const result = await this.request('/tools/call-actor', {
      method: 'POST',
      body: JSON.stringify({
        actorId: resourceId,
        input,
      }),
    })

    return {
      id: result.runId || result.id,
      status: 'running',
      createdAt: new Date().toISOString(),
      ...result,
    }
  }

  /**
   * Get the status of a gathering task
   */
  async getTaskStatus(taskId: string): Promise<GatheringTask> {
    return this.request('/tools/get-actor-run', {
      method: 'POST',
      body: JSON.stringify({ runId: taskId }),
    })
  }

  /**
   * Get the output of a completed gathering task
   */
  async getTaskOutput(datasetId: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    return this.request('/tools/get-dataset-items', {
      method: 'POST',
      body: JSON.stringify({
        datasetId,
        limit: options?.limit || 100,
        offset: options?.offset || 0,
      }),
    })
  }

  /**
   * Get logs for a gathering task
   */
  async getTaskLogs(taskId: string): Promise<string> {
    return this.request('/tools/get-actor-log', {
      method: 'POST',
      body: JSON.stringify({ runId: taskId }),
    })
  }

  /**
   * List all datasets (stored resources)
   */
  async listStoredResources(): Promise<any[]> {
    return this.request('/tools/get-dataset-list', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  /**
   * Get stored resource metadata
   */
  async getStoredResource(datasetId: string): Promise<any> {
    return this.request('/tools/get-dataset', {
      method: 'POST',
      body: JSON.stringify({ datasetId }),
    })
  }

  /**
   * Browse the web and gather content (RAG-enabled)
   */
  async browseAndGather(query: string, maxResults = 10): Promise<any> {
    return this.request('/tools/apify-slash-rag-web-browser', {
      method: 'POST',
      body: JSON.stringify({
        query,
        maxResults,
      }),
    })
  }

  /**
   * Search documentation for integration help
   */
  async searchDocs(query: string): Promise<any[]> {
    return this.request('/tools/search-apify-docs', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  /**
   * List key-value stores
   */
  async listKeyValueStores(): Promise<any[]> {
    return this.request('/tools/get-key-value-store-list', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  /**
   * Get value from key-value store
   */
  async getStoredValue(storeId: string, key: string): Promise<any> {
    return this.request('/tools/get-key-value-store-record', {
      method: 'POST',
      body: JSON.stringify({ storeId, key }),
    })
  }
}

export const resourceGateway = new ResourceGatewayClient()
export default resourceGateway
