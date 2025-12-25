import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

function getFirebaseApp() {
  if (app) return app
  
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    console.warn('Firebase not configured - missing NEXT_PUBLIC_FIREBASE_API_KEY')
    return null
  }

  const firebaseConfig = {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return app
}

export function getFirebaseAuth() {
  if (auth) return auth
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  auth = getAuth(firebaseApp)
  return auth
}

export function getFirebaseDb() {
  if (db) return db
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  db = getFirestore(firebaseApp)
  return db
}

export function getFirebaseStorage() {
  if (storage) return storage
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  storage = getStorage(firebaseApp)
  return storage
}

export { app, auth, db, storage }
export default getFirebaseApp
