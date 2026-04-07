import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize Firebase on the client side and when config is available
function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.apiKey) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getAppInstance(): FirebaseApp {
  if (!_app) _app = getFirebaseApp();
  if (!_app) throw new Error('Firebase not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY to your .env.local');
  return _app;
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(getAppInstance());
  return _auth;
}

export function getDbInstance(): Firestore {
  if (!_db) _db = getFirestore(getAppInstance());
  return _db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getAppInstance());
  return _storage;
}

// Convenience getters (lazy) — safe to import anywhere
export const auth = { get current() { return getAuthInstance(); } };
export const db = { get current() { return getDbInstance(); } };
export const storage = { get current() { return getStorageInstance(); } };

export default { get current() { return getAppInstance(); } };
