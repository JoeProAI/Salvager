import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(request: NextRequest) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json(
        { error: 'MCP gateway not configured. Set RESOURCE_GATEWAY_TOKEN.' },
        { status: 503 }
      )
    }

    const tools = await resourceGateway.getAvailableTools()

    return NextResponse.json({
      success: true,
      tools: tools.map((t: any) => ({
        name: t.name,
        description: t.description,
      })),
      count: tools.length,
    })
  } catch (error: any) {
    console.error('[MCP] Failed to get tools:', error)
    return NextResponse.json(
      { error: 'Failed to get MCP tools', details: error.message },
      { status: 500 }
    )
  }
}
