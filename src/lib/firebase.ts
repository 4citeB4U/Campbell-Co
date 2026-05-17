/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFD700
FLUO=#FFEA00
PASTEL=#FFF9C4

ICON_ASCII:
family=lucide
glyph=wrench

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: DATA
TAG: DATA.SRC.LIB.FIREBASE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = firebase.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/lib/firebase.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Firestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseKeys = [
  firebaseConfig.projectId,
  firebaseConfig.appId,
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
];

export const isFirebaseConfigured = requiredFirebaseKeys.every((value) => {
  return typeof value === 'string' && value.trim() !== '' && !value.startsWith('your-');
});

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  if (!auth) {
    return Promise.reject(new Error('Firebase is not configured. Add valid VITE_FIREBASE_* values to your .env file.'));
  }

  return signInWithPopup(auth, googleProvider);
};

async function testConnection() {
  if (!db) return;

  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection established.");
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
