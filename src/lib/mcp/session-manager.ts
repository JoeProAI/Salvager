/**
 * MCP Session Manager
 * Manages MCP client sessions with connection pooling and persistence
 */

import MCPClient from './client'

interface SessionEntry {
  client: MCPClient
  createdAt: Date
  lastUsed: Date
  userId?: string
}

class MCPSessionManager {
  private sessions: Map<string, SessionEntry> = new Map()
  private defaultToken: string | null = null
  private sessionTimeout = 30 * 60 * 1000 // 30 minutes

  constructor() {
    // Clean up expired sessions periodically
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000)
    }
  }

  /**
   * Set default Apify token
   */
  setDefaultToken(token: string): void {
    this.defaultToken = token
  }

  /**
   * Get or create an MCP session
   */
  async getSession(sessionKey?: string, token?: string): Promise<MCPClient> {
    const key = sessionKey || 'default'
    const apiToken = token || this.defaultToken || process.env.RESOURCE_GATEWAY_TOKEN

    if (!apiToken) {
      throw new Error('No Apify token configured')
    }

    // Check for existing session
    const existing = this.sessions.get(key)
    if (existing && existing.client.isInitialized()) {
      existing.lastUsed = new Date()
      return existing.client
    }

    // Create new session
    console.log(`[MCP Manager] Creating new session: ${key}`)
    const client = new MCPClient(apiToken)
    await client.initialize()

    this.sessions.set(key, {
      client,
      createdAt: new Date(),
      lastUsed: new Date(),
    })

    return client
  }

  /**
   * Get session for a specific user
   */
  async getUserSession(userId: string, token?: string): Promise<MCPClient> {
    return this.getSession(`user:${userId}`, token)
  }

  /**
   * Close a specific session
   */
  async closeSession(sessionKey: string): Promise<void> {
    const entry = this.sessions.get(sessionKey)
    if (entry) {
      await entry.client.close()
      this.sessions.delete(sessionKey)
      console.log(`[MCP Manager] Closed session: ${sessionKey}`)
    }
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = Date.now()
    const expired: string[] = []

    this.sessions.forEach((entry, key) => {
      if (now - entry.lastUsed.getTime() > this.sessionTimeout) {
        expired.push(key)
      }
    })

    expired.forEach(async (key) => {
      await this.closeSession(key)
    })

    if (expired.length > 0) {
      console.log(`[MCP Manager] Cleaned up ${expired.length} expired sessions`)
    }
  }

  /**
   * Get all active sessions count
   */
  getActiveSessionCount(): number {
    return this.sessions.size
  }

  /**
   * Close all sessions
   */
  async closeAllSessions(): Promise<void> {
    const keys = Array.from(this.sessions.keys())
    for (const key of keys) {
      await this.closeSession(key)
    }
    console.log('[MCP Manager] All sessions closed')
  }
}

// Singleton instance
export const mcpManager = new MCPSessionManager()
export default mcpManager
