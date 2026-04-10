// This is the CLIENT side Firebase setup — lives in the Expo app, not the backend
// The client SDK handles signing users in and getting tokens
// It is completely separate from the Admin SDK in the backend
 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
 
// These are your Firebase project's public config values
// Unlike the serviceAccountKey, these are SAFE to be in your frontend code
// They identify your project but don't grant any special access on their own
// Find these in: Firebase Console → Project Settings → General → Your Apps


const firebaseConfig = {
  apiKey: "AIzaSyDmjp2TbnLDY1WbmQV7YE5R23awV0NUYAc",
  authDomain: "boarcastdatabase.firebaseapp.com",
  projectId: "boarcastdatabase",
  storageBucket: "boarcastdatabase.firebasestorage.app",
  messagingSenderId: "106547463515",
  appId: "1:106547463515:web:ba998d7633dc5039a0067e",
};


// Initialize the Firebase app with your config
// Like the backend, this only needs to happen once
const app = initializeApp(firebaseConfig);
 
// Get the auth instance — this is what you'll use to sign in, sign out, and get tokens
// Think of it like the client-side equivalent of admin.auth() in the backend
export const auth = getAuth(app);
