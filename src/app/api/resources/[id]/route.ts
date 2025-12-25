import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Resource gateway not configured'
      }, { status: 503 })
    }

    const resourceId = params.id

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const resource = await resourceGateway.getResourceDetails(resourceId)

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
    console.error('Resource details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource details', details: error.message },
      { status: 500 }
    )
  }
}
