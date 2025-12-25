import { NextRequest, NextResponse } from 'next/server'
import { resourceGateway } from '@/lib/resource-gateway'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const task = await resourceGateway.getTaskStatus(taskId)

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        status: task.status,
        progress: task.progress,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        error: task.error,
      },
    })
  } catch (error: any) {
    console.error('Task status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task status', details: error.message },
      { status: 500 }
    )
  }
}
