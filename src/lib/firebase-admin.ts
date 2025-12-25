let adminApp: any = null
let adminAuth: any = null
let adminDb: any = null

async function getAdminApp() {
  if (adminApp) return adminApp
  
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin not configured - missing environment variables')
    return null
  }

  const { initializeApp, getApps, cert } = await import('firebase-admin/app')

  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  }

  adminApp = getApps().length === 0 
    ? initializeApp({ credential: cert(serviceAccount as any) })
    : getApps()[0]
  
  return adminApp
}

export async function getAdminAuth() {
  if (adminAuth) return adminAuth
  const app = await getAdminApp()
  if (!app) return null
  const { getAuth } = await import('firebase-admin/auth')
  adminAuth = getAuth(app)
  return adminAuth
}

export async function getAdminDb() {
  if (adminDb) return adminDb
  const app = await getAdminApp()
  if (!app) return null
  const { getFirestore } = await import('firebase-admin/firestore')
  adminDb = getFirestore(app)
  return adminDb
}

export { adminApp, adminAuth, adminDb }
export default getAdminApp
