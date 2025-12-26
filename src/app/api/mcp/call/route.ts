import { NextRequest, NextResponse } from 'next/server'
import { mcpManager } from '@/lib/mcp'

export async function POST(request: NextRequest) {
  try {
    const token = process.env.RESOURCE_GATEWAY_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'MCP gateway not configured. Set RESOURCE_GATEWAY_TOKEN.' },
        { status: 503 }
      )
    }

    const { tool, args } = await request.json()

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      )
    }

    console.log(`[MCP API] Calling tool: ${tool}`, args)
    
    const client = await mcpManager.getSession('default', token)
    const result = await client.callTool(tool, args || {})

    return NextResponse.json({
      success: true,
      tool,
      result,
    })
  } catch (error: any) {
    console.error('[MCP API] Tool call failed:', error)
    return NextResponse.json(
      { error: 'MCP tool call failed', details: error.message },
      { status: 500 }
    )
  }
}
