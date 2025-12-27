import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json(
        { error: 'MCP gateway not configured. Set RESOURCE_GATEWAY_TOKEN.' },
        { status: 503 }
      )
    }

    const resourceId = decodeURIComponent(params.id)

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    console.log(`[MCP] Fetching actor details: ${resourceId}`)
    const resource = await resourceGateway.getResourceDetails(resourceId)
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    console.log(`[MCP] Got details for: ${resource.name}`)

    return NextResponse.json({
      success: true,
      resource: {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        category: resource.category,
        inputSchema: resource.inputSchema,
      },
    })
  } catch (error: any) {
    console.error('[MCP] Resource details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource details', details: error.message },
      { status: 500 }
    )
  }
}
