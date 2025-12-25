import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Resource gateway not configured'
      }, { status: 503 })
    }

    const datasetId = params.datasetId
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!datasetId) {
      return NextResponse.json(
        { error: 'Dataset ID is required' },
        { status: 400 }
      )
    }

    // Get dataset metadata
    const metadata = await resourceGateway.getStoredResource(datasetId)
    
    // Get dataset items
    const items = await resourceGateway.getTaskOutput(datasetId, { limit, offset })

    return NextResponse.json({
      success: true,
      dataset: {
        id: metadata.id,
        name: metadata.name,
        itemCount: metadata.itemCount,
        createdAt: metadata.createdAt,
      },
      items,
      pagination: {
        limit,
        offset,
        total: metadata.itemCount,
      },
    })
  } catch (error: any) {
    console.error('Storage fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stored resource', details: error.message },
      { status: 500 }
    )
  }
}
