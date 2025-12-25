import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function POST(request: NextRequest) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: true,
        resources: [],
        message: 'Resource gateway not configured'
      })
    }

    const { query, limit = 20 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const resources = await resourceGateway.discoverResources(query, limit)

    return NextResponse.json({
      success: true,
      resources: resources.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category || 'general',
        capabilities: r.capabilities || [],
      })),
    })
  } catch (error: any) {
    console.error('Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!resourceGateway.isConfigured()) {
    return NextResponse.json({
      success: true,
      resources: [],
      message: 'Resource gateway not configured'
    })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  try {
    const resources = await resourceGateway.discoverResources(query, limit)

    return NextResponse.json({
      success: true,
      resources,
    })
  } catch (error: any) {
    console.error('Resource discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover resources', details: error.message },
      { status: 500 }
    )
  }
}
