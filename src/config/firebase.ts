import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL9rMO4HOIhbLttVb8FeT9X20eXxO2cWs",
  authDomain: "cleopatra-7b03b.firebaseapp.com",
  projectId: "cleopatra-7b03b",
  storageBucket: "cleopatra-7b03b.firebasestorage.app",
  messagingSenderId: "122861877579",
  appId: "1:122861877579:web:3bdda167a1cc18347510ce",
  measurementId: "G-5PR3W3E7G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;