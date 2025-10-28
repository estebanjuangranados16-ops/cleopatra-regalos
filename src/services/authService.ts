import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  displayName: string;
  role: 'admin' | 'customer';
  createdAt: string;
  lastLogin: string;
}

export const authService = {
  // Iniciar sesión
  async signIn(email: string, password: string): Promise<UserProfile> {
    // Mock authentication for development
    if (email === 'admin@cleopatra.com' && password === 'admin123') {
      const mockAdmin: UserProfile = {
        id: 'admin-mock',
        uid: 'admin-mock',
        email: 'admin@cleopatra.com',
        name: 'Administrador',
        displayName: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      return mockAdmin;
    }

    if (!auth || !db) {
      throw new Error('Firebase no configurado');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Actualizar último login
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      return await this.getUserProfile(user.uid);
    } catch (error) {
      // Fallback to mock for common test accounts
      if (email === 'usuario@test.com' && password === 'test123') {
        const mockUser: UserProfile = {
          id: 'user-mock',
          uid: 'user-mock',
          email: 'usuario@test.com',
          name: 'Usuario Test',
          displayName: 'Usuario Test',
          role: 'customer',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        return mockUser;
      }
      throw error;
    }
  },

  // Registrar usuario
  async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    if (!auth || !db) {
      throw new Error('Firebase no configurado');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar perfil
    await updateProfile(user, { displayName });
    
    // Crear documento de usuario
    const userProfile: UserProfile = {
      id: user.uid,
      uid: user.uid,
      email: user.email!,
      name: displayName,
      displayName,
      role: 'customer', // Por defecto customer
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return userProfile;
  },

  // Cerrar sesión
  async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Firebase no configurado');
    }
    await signOut(auth);
  },

  // Obtener perfil de usuario
  async getUserProfile(uid: string): Promise<UserProfile> {
    if (!db) {
      throw new Error('Firebase no configurado');
    }

    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const data = userDoc.data();
    // Ensure backward compatibility
    return {
      id: data.id || data.uid,
      uid: data.uid,
      email: data.email,
      name: data.name || data.displayName,
      displayName: data.displayName,
      role: data.role,
      createdAt: data.createdAt,
      lastLogin: data.lastLogin
    } as UserProfile;
  },

  // Verificar si es admin
  async isAdmin(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile.role === 'admin';
    } catch {
      return false;
    }
  },

  // Crear admin (solo para setup inicial)
  async createAdmin(email: string, password: string, displayName: string): Promise<UserProfile> {
    if (!auth || !db) {
      throw new Error('Firebase no configurado');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName });
    
    const adminProfile: UserProfile = {
      id: user.uid,
      uid: user.uid,
      email: user.email!,
      name: displayName,
      displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), adminProfile);
    
    return adminProfile;
  },

  // Escuchar cambios de autenticación
  onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth?.currentUser || null;
  }
};