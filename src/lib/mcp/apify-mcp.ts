/**
 * Apify MCP Client
 * Stateless MCP client optimized for serverless environments
 * Each request initializes a fresh session
 */

export interface MCPToolResult {
  success: boolean
  data: any
  error?: string
  tool: string
  sessionId?: string
}

export interface ApifyActor {
  id: string
  name: string
  title?: string
  description: string
  username?: string
  categories?: string[]
}

class ApifyMCPClient {
  private baseUrl = 'https://mcp.apify.com'
  
  private getToken(): string {
    return process.env.RESOURCE_GATEWAY_TOKEN || ''
  }

  isConfigured(): boolean {
    return !!process.env.RESOURCE_GATEWAY_TOKEN
  }

  /**
   * Initialize MCP session and call a tool in one request flow
   */
  async callTool(toolName: string, args: Record<string, any> = {}): Promise<MCPToolResult> {
    const token = this.getToken()
    if (!token) {
      return { success: false, data: null, error: 'No API token configured', tool: toolName }
    }

    const url = `${this.baseUrl}?token=${token}`
    let sessionId: string | null = null

    try {
      // Step 1: Initialize session
      console.log(`[MCP] Initializing session...`)
      const initResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            clientInfo: { name: 'salvage-ops-agent', version: '1.0.0' },
          },
        }),
      })

      if (!initResponse.ok) {
        const error = await initResponse.text()
        throw new Error(`Init failed: ${error}`)
      }

      // Get session ID from header
      sessionId = initResponse.headers.get('mcp-session-id')
      console.log(`[MCP] Session: ${sessionId}`)

      if (!sessionId) {
        throw new Error('No session ID returned')
      }

      // Step 2: Send initialized notification
      const sessionUrl = `${this.baseUrl}?token=${token}&sessionId=${sessionId}`
      await fetch(sessionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Mcp-Session-Id': sessionId,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'notifications/initialized',
          params: {},
        }),
      })

      // Step 3: Call the tool
      console.log(`[MCP] Calling tool: ${toolName}`, args)
      const toolResponse = await fetch(sessionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Mcp-Session-Id': sessionId,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args,
          },
        }),
      })

      if (!toolResponse.ok) {
        const error = await toolResponse.text()
        throw new Error(`Tool call failed: ${error}`)
      }

      const result = await toolResponse.json()
      
      if (result.error) {
        throw new Error(result.error.message || JSON.stringify(result.error))
      }

      // Parse the result content
      const data = this.parseToolResult(result.result)
      console.log(`[MCP] Tool ${toolName} returned data`)

      return { success: true, data, tool: toolName, sessionId: sessionId || undefined }
    } catch (error: any) {
      console.error(`[MCP] Error calling ${toolName}:`, error.message)
      return { success: false, data: null, error: error.message, tool: toolName, sessionId: sessionId || undefined }
    }
  }

  /**
   * Parse MCP tool result content
   */
  private parseToolResult(result: any): any {
    if (!result) return null

    if (result.content && Array.isArray(result.content)) {
      const textParts: string[] = []
      for (const item of result.content) {
        if (item.type === 'text' && item.text) {
          textParts.push(item.text)
        }
      }

      if (textParts.length > 0) {
        const fullText = textParts.join('\n')
        try {
          return JSON.parse(fullText)
        } catch {
          return fullText
        }
      }
    }

    return result
  }

  /**
   * Search for actors in Apify Store
   */
  async searchActors(query: string, limit = 10): Promise<ApifyActor[]> {
    const result = await this.callTool('search-actors', { search: query, limit })
    
    if (!result.success || !Array.isArray(result.data)) {
      console.error('[MCP] searchActors failed:', result.error)
      return []
    }

    return result.data.map((actor: any) => ({
      id: actor.id || actor.actorId || `${actor.username}/${actor.name}`,
      name: actor.name || actor.title || 'Unknown',
      title: actor.title,
      description: actor.description || '',
      username: actor.username,
      categories: actor.categories || [],
    }))
  }

  /**
   * Get actor details
   */
  async getActorDetails(actorId: string): Promise<any> {
    const result = await this.callTool('fetch-actor-details', { actorId })
    return result.success ? result.data : null
  }

  /**
   * Run an actor
   */
  async runActor(actorId: string, input: Record<string, any>): Promise<any> {
    const result = await this.callTool('call-actor', { actorId, input })
    return result
  }

  /**
   * Get actor run status
   */
  async getRunStatus(runId: string): Promise<any> {
    const result = await this.callTool('get-actor-run', { runId })
    return result.success ? result.data : null
  }

  /**
   * Get actor output
   */
  async getActorOutput(datasetId: string, limit = 100): Promise<any[]> {
    const result = await this.callTool('get-actor-output', { datasetId, limit })
    return result.success && Array.isArray(result.data) ? result.data : []
  }

  /**
   * List available MCP tools
   */
  async listTools(): Promise<any[]> {
    const token = this.getToken()
    if (!token) return []

    const url = `${this.baseUrl}?token=${token}`

    try {
      // Initialize
      const initResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            clientInfo: { name: 'salvage-ops-agent', version: '1.0.0' },
          },
        }),
      })

      const sessionId = initResponse.headers.get('mcp-session-id')
      if (!sessionId) return []

      // List tools
      const sessionUrl = `${this.baseUrl}?token=${token}&sessionId=${sessionId}`
      const toolsResponse = await fetch(sessionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Mcp-Session-Id': sessionId,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        }),
      })

      const result = await toolsResponse.json()
      return result.result?.tools || []
    } catch (error) {
      console.error('[MCP] Failed to list tools:', error)
      return []
    }
  }
}

export const apifyMCP = new ApifyMCPClient()
export default apifyMCP
