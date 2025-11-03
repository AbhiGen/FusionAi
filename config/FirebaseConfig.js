// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "fusionai-51516.firebaseapp.com",
  projectId: "fusionai-51516",
  storageBucket: "fusionai-51516.firebasestorage.app",
  messagingSenderId: "841222884295",
  appId: "1:841222884295:web:004f1081cfc7a16732e7e2",
  measurementId: "G-HPML81W5ET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);