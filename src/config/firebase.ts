import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration - credenciales reales
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
let app: any = null;
let db: any = null;
let storage: any = null;
let auth: any = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  console.log('🔥 Firebase conectado exitosamente a:', firebaseConfig.projectId);
  console.log('📊 Base de datos Firestore lista');
  console.log('📁 Storage configurado');
} catch (error) {
  console.error('❌ Error al conectar Firebase:', error);
  console.log('📱 Usando modo local como respaldo');
  db = null;
  storage = null;
  auth = null;
}

export { db, storage, auth };
export default app;