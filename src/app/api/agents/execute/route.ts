import { NextRequest, NextResponse } from 'next/server'
import { mcpExecutor } from '@/lib/agents'

export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'search':
        result = await mcpExecutor.searchActors(
          params.query || 'scraper',
          params.limit || 10
        )
        break

      case 'details':
        if (!params.actorId) {
          return NextResponse.json(
            { error: 'actorId is required for details action' },
            { status: 400 }
          )
        }
        result = await mcpExecutor.getActorDetails(params.actorId)
        break

      case 'run':
        if (!params.actorId) {
          return NextResponse.json(
            { error: 'actorId is required for run action' },
            { status: 400 }
          )
        }
        result = await mcpExecutor.runActor(params.actorId, params.input || {})
        break

      case 'status':
        if (!params.runId) {
          return NextResponse.json(
            { error: 'runId is required for status action' },
            { status: 400 }
          )
        }
        result = await mcpExecutor.getRunStatus(params.runId)
        break

      case 'output':
        if (!params.datasetId) {
          return NextResponse.json(
            { error: 'datasetId is required for output action' },
            { status: 400 }
          )
        }
        result = await mcpExecutor.getActorOutput(params.datasetId, params.limit || 100)
        break

      case 'pipeline':
        result = await mcpExecutor.runExtractionPipeline(
          params.query || 'web scraper',
          params.extractionParams || {}
        )
        break

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      action,
      result,
    })
  } catch (error: any) {
    console.error('[Agent Execute] Error:', error)
    return NextResponse.json(
      { error: 'Agent execution failed', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const tools = await mcpExecutor.getAvailableTools()
    const activeTasks = mcpExecutor.getActiveTasks()

    return NextResponse.json({
      success: true,
      tools: tools.map((t: any) => ({
        name: t.name,
        description: t.description,
      })),
      activeTasks: activeTasks.length,
    })
  } catch (error: any) {
    console.error('[Agent Execute] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent status', details: error.message },
      { status: 500 }
    )
  }
}
