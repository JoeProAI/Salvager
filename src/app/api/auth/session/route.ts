import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const adminAuth = getAdminAuth()
    if (!adminAuth) {
      return NextResponse.json(
        { authenticated: false, error: 'Auth not configured' },
        { status: 503 }
      )
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        name: decodedClaims.name,
      },
    })
  } catch (error: any) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Invalid session' },
      { status: 401 }
    )
  }
}
