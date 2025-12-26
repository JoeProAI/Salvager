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

    const { query, limit = 20 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    console.log(`[MCP] Searching actors: "${query}"`)
    const resources = await resourceGateway.discoverResources(query, limit)
    console.log(`[MCP] Found ${resources.length} actors`)

    return NextResponse.json({
      success: true,
      resources: resources.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category || 'general',
      })),
    })
  } catch (error: any) {
    console.error('[MCP] Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!resourceGateway.isConfigured()) {
    return NextResponse.json(
      { error: 'MCP gateway not configured. Set RESOURCE_GATEWAY_TOKEN.' },
      { status: 503 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || 'scraper'
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    console.log(`[MCP] GET searching actors: "${query}"`)
    const resources = await resourceGateway.discoverResources(query, limit)
    
    return NextResponse.json({
      success: true,
      resources,
    })
  } catch (error: any) {
    console.error('[MCP] Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}
