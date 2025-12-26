import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function POST(request: NextRequest) {
  try {
    const { resourceId, input, options } = await request.json()

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // Demo mode - simulate task creation
    if (!resourceGateway.isConfigured()) {
      const demoTaskId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      return NextResponse.json({
        success: true,
        demo: true,
        task: {
          id: demoTaskId,
          status: 'running',
          createdAt: new Date().toISOString(),
          message: 'Demo mode - simulating extraction. Configure RESOURCE_GATEWAY_TOKEN for real data.',
        },
      })
    }

    const task = await resourceGateway.startGathering(resourceId, input || {})

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
