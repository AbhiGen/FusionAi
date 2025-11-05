// config/FirebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "fusionai-51516.firebaseapp.com",
  projectId: "fusionai-51516",
  storageBucket: "fusionai-51516.firebasestorage.app",
  messagingSenderId: "841222884295",
  appId: "1:841222884295:web:004f1081cfc7a16732e7e2",
  measurementId: "G-HPML81W5ET",
};

// ✅ Initialize Firebase safely (avoids multiple inits during hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Firestore only
export const db = getFirestore(app);

// ⚠️ Do NOT import or use analytics here (causes SSR build failure)

export default app;
