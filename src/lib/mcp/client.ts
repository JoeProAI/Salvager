/**
 * MCP Client for Apify
 * Implements the Model Context Protocol for stateful communication
 * with mcp.apify.com
 */

export interface MCPSession {
  id: string
  createdAt: Date
  lastUsed: Date
  tools: MCPTool[]
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, any>
}

export interface MCPMessage {
  jsonrpc: '2.0'
  id: number | string
  method?: string
  params?: Record<string, any>
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

class MCPClient {
  private baseUrl = 'https://mcp.apify.com'
  private token: string
  private sessionId: string | null = null
  private messageId = 0
  private tools: MCPTool[] = []
  private initialized = false

  constructor(token: string) {
    this.token = token
  }

  /**
   * Get next message ID
   */
  private nextId(): number {
    return ++this.messageId
  }

  /**
   * Send JSON-RPC message to MCP server
   */
  private async sendMessage(message: Partial<MCPMessage>): Promise<MCPMessage> {
    const url = new URL(this.baseUrl)
    url.searchParams.set('token', this.token)
    if (this.sessionId) {
      url.searchParams.set('sessionId', this.sessionId)
    }

    const fullMessage: MCPMessage = {
      jsonrpc: '2.0',
      id: message.id || this.nextId(),
      ...message,
    } as MCPMessage

    console.log(`[MCP] Sending: ${message.method}`, message.params)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    }
    
    // Include session ID in header as well
    if (this.sessionId) {
      headers['Mcp-Session-Id'] = this.sessionId
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(fullMessage),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`MCP request failed: ${response.status} - ${error}`)
    }

    // Check for session ID in response headers
    const headerSessionId = response.headers.get('mcp-session-id')
    if (headerSessionId) {
      this.sessionId = headerSessionId
      console.log(`[MCP] Session ID from header: ${this.sessionId}`)
    }

    const contentType = response.headers.get('content-type') || ''
    
    // Handle SSE streaming response
    if (contentType.includes('text/event-stream')) {
      return this.parseSSEResponse(await response.text())
    }

    // Handle JSON response
    const result = await response.json()
    
    // Extract session ID from response body if present
    if (result.result?._meta?.sessionId) {
      this.sessionId = result.result._meta.sessionId
      console.log(`[MCP] Session ID from body: ${this.sessionId}`)
    }

    if (result.error) {
      throw new Error(`MCP error: ${result.error.message}`)
    }

    return result
  }

  /**
   * Parse Server-Sent Events response
   */
  private parseSSEResponse(text: string): MCPMessage {
    const lines = text.split('\n')
    let lastResult: MCPMessage | null = null

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.result?._meta?.sessionId) {
            this.sessionId = data.result._meta.sessionId
          }
          lastResult = data
        } catch (e) {
          // Skip non-JSON lines
        }
      }
    }

    if (!lastResult) {
      throw new Error('No valid response in SSE stream')
    }

    return lastResult
  }

  /**
   * Initialize MCP session
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    console.log('[MCP] Initializing session...')

    // Send initialize request
    const initResponse = await this.sendMessage({
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
        },
        clientInfo: {
          name: 'salvage-ops',
          version: '1.0.0',
        },
      },
    })

    console.log('[MCP] Initialize response:', initResponse.result)

    // Send initialized notification
    await this.sendMessage({
      method: 'notifications/initialized',
      params: {},
    })

    this.initialized = true
    console.log('[MCP] Session initialized')

    // Discover available tools
    await this.discoverTools()
  }

  /**
   * Discover available MCP tools
   */
  async discoverTools(): Promise<MCPTool[]> {
    if (!this.initialized) {
      await this.initialize()
    }

    const response = await this.sendMessage({
      method: 'tools/list',
      params: {},
    })

    this.tools = response.result?.tools || []
    console.log(`[MCP] Discovered ${this.tools.length} tools`)
    
    return this.tools
  }

  /**
   * Call an MCP tool
   */
  async callTool(name: string, args: Record<string, any> = {}): Promise<any> {
    if (!this.initialized) {
      await this.initialize()
    }

    console.log(`[MCP] Calling tool: ${name}`, args)

    const response = await this.sendMessage({
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    })

    // Parse tool result content
    const result = response.result
    console.log(`[MCP] Raw result:`, JSON.stringify(result)?.slice(0, 500) || 'null')
    
    if (result?.content && Array.isArray(result.content)) {
      // Collect all text content
      const textParts: string[] = []
      for (const item of result.content) {
        if (item.type === 'text' && item.text) {
          textParts.push(item.text)
        }
      }
      
      if (textParts.length > 0) {
        const fullText = textParts.join('\n')
        console.log(`[MCP] Text content (first 500 chars):`, fullText.slice(0, 500))
        
        // Try to parse as JSON
        try {
          return JSON.parse(fullText)
        } catch {
          // Maybe it's multiple JSON objects or plain text
          return fullText
        }
      }
    }

    return result
  }

  /**
   * Get available tools
   */
  getTools(): MCPTool[] {
    return this.tools
  }

  /**
   * Check if session is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    return this.sessionId
  }

  /**
   * Close session
   */
  async close(): Promise<void> {
    this.sessionId = null
    this.initialized = false
    this.tools = []
    console.log('[MCP] Session closed')
  }
}

export default MCPClient
