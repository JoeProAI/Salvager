import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(request: NextRequest) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: true,
        datasets: [],
        message: 'Resource gateway not configured'
      })
    }

    const datasets = await resourceGateway.listStoredResources()

    return NextResponse.json({
      success: true,
      datasets: datasets.map((d: any) => ({
        id: d.id,
        name: d.name,
        itemCount: d.itemCount,
        createdAt: d.createdAt,
        modifiedAt: d.modifiedAt,
      })),
    })
  } catch (error: any) {
    console.error('Storage list error:', error)
    return NextResponse.json(
      { error: 'Failed to list stored resources', details: error.message },
      { status: 500 }
    )
  }
}
