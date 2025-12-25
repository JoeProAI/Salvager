import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    if (!resourceGateway.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Resource gateway not configured'
      }, { status: 503 })
    }

    const taskId = params.taskId
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // First get task status to find the dataset ID
    const task = await resourceGateway.getTaskStatus(taskId)
    
    if (task.status !== 'completed') {
      return NextResponse.json(
        { 
          error: 'Task not completed', 
          status: task.status,
          progress: task.progress 
        },
        { status: 202 }
      )
    }

    // Get the output data
    const datasetId = (task as any).defaultDatasetId || taskId
    const output = await resourceGateway.getTaskOutput(datasetId, { limit, offset })

    return NextResponse.json({
      success: true,
      data: output,
      pagination: {
        limit,
        offset,
        total: (task as any).itemCount || output.length,
      },
    })
  } catch (error: any) {
    console.error('Task output error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task output', details: error.message },
      { status: 500 }
    )
  }
}
