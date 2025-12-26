import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function POST(request: NextRequest) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json(
        { error: 'MCP gateway not configured. Set RESOURCE_GATEWAY_TOKEN.' },
        { status: 503 }
      )
    }

    const { resourceId, input, options } = await request.json()

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    console.log(`[MCP] Starting actor: ${resourceId}`)
    console.log(`[MCP] Input:`, JSON.stringify(input, null, 2))
    
    const task = await resourceGateway.startGathering(resourceId, input || {})
    console.log(`[MCP] Task started: ${task.id}`)

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        status: task.status,
        createdAt: task.createdAt,
        message: 'Resource gathering initiated',
      },
    })
  } catch (error: any) {
    console.error('Gathering error:', error)
    return NextResponse.json(
      { error: 'Failed to start gathering', details: error.message },
      { status: 500 }
    )
  }
}
