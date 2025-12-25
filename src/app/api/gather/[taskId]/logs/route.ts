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

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const logs = await resourceGateway.getTaskLogs(taskId)

    return NextResponse.json({
      success: true,
      logs,
    })
  } catch (error: any) {
    console.error('Task logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task logs', details: error.message },
      { status: 500 }
    )
  }
}
