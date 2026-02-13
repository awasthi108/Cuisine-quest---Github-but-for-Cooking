import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAcgfoH0Z7T57JEWO0NSEgT-xB8GUtW_t0',
  authDomain: 'cusine-quest.firebaseapp.com',
  projectId: 'cusine-quest',
  storageBucket: 'cusine-quest.firebasestorage.app',
  messagingSenderId: '373568176538',
  appId: '1:373568176538:web:e7fd120d0b35f973c8fa23',
  measurementId: 'G-1DJE220ED6',
}

// Validate Firebase config
if (!firebaseConfig.apiKey) {
  console.error('[v0] Firebase API Key is missing. Check your environment variables.')
  throw new Error('Firebase API Key is required. Please set NEXT_PUBLIC_FIREBASE_API_KEY.')
}

// Initialize Firebase
let app
try {
  const apps = getApps()
  app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)
} catch (error) {
  console.error('[v0] Firebase initialization error:', error)
  throw error
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
