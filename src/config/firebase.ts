import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Temporary disable Firebase for demo
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
  measurementId: "G-DEMO"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_PROJECT_ID && 
  process.env.REACT_APP_FIREBASE_PROJECT_ID !== 'your-project-id';

if (isFirebaseConfigured) {
  firebaseConfig.apiKey = process.env.REACT_APP_FIREBASE_API_KEY!;
  firebaseConfig.authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!;
  firebaseConfig.projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID!;
  firebaseConfig.storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!;
  firebaseConfig.messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!;
  firebaseConfig.appId = process.env.REACT_APP_FIREBASE_APP_ID!;
  firebaseConfig.measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID!;
}

// Initialize Firebase
let app: any = null;
let db: any = null;
let storage: any = null;
let auth: any = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Only initialize services if Firebase is properly configured
  if (isFirebaseConfigured) {
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } else {
    console.log('Firebase not configured - using demo mode');
  }
} catch (error) {
  console.log('Firebase initialization failed - using demo mode');
}

export { db, storage, auth };

export default app;