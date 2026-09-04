import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredConfig = [
  ['VITE_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
  ['VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
  ['VITE_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
  ['VITE_FIREBASE_APP_ID', firebaseConfig.appId],
]

const missingConfig = requiredConfig
  .filter(([, value]) => !value)
  .map(([name]) => name)

export let firebaseConfigError = ''
export let db = null
export let auth = null

if (missingConfig.length > 0) {
  firebaseConfigError = `Missing Firebase environment variables: ${missingConfig.join(', ')}`
  console.error(firebaseConfigError)
} else {
  try {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (err) {
    firebaseConfigError = err?.message || 'Firebase could not be initialized.'
    console.error(firebaseConfigError)
  }
}

export const isFirebaseConfigured = Boolean(db && auth)

export function requireFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigError || 'Firebase is not configured.')
  }
  return { db, auth }
}
