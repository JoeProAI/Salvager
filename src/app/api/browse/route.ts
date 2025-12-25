import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

/**
 * Web browsing and content gathering endpoint
 * Uses RAG-enabled browser to search and extract content
 */
export async function POST(request: NextRequest) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'Resource gateway not configured'
      })
    }

    const { query, maxResults = 10 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const results = await resourceGateway.browseAndGather(query, maxResults)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error('Browse error:', error)
    return NextResponse.json(
      { error: 'Failed to browse and gather', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!resourceGateway.isConfigured()) {
    return NextResponse.json({
      success: true,
      results: [],
      message: 'Resource gateway not configured'
    })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const maxResults = parseInt(searchParams.get('max') || '10')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  try {
    const results = await resourceGateway.browseAndGather(query, maxResults)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error('Browse error:', error)
    return NextResponse.json(
      { error: 'Failed to browse and gather', details: error.message },
      { status: 500 }
    )
  }
}
