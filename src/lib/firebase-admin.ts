import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let app: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null

function getAdminApp() {
  if (app) return app
  
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin not configured - missing environment variables')
    return null
  }

  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  }

  app = getApps().length === 0 
    ? initializeApp({ credential: cert(serviceAccount as any) })
    : getApps()[0]
  
  return app
}

export function getAdminAuth() {
  if (adminAuth) return adminAuth
  const adminApp = getAdminApp()
  if (!adminApp) return null
  adminAuth = getAuth(adminApp)
  return adminAuth
}

export function getAdminDb() {
  if (adminDb) return adminDb
  const adminApp = getAdminApp()
  if (!adminApp) return null
  adminDb = getFirestore(adminApp)
  return adminDb
}

export { app, adminAuth, adminDb }
export default getAdminApp
