import { User } from '../types/user';

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeAdminUser();
  }

  private initializeAdminUser() {
    // Crear usuario admin por defecto si no existe
    const adminExists = this.users.find(u => u.email === 'admin@cleopatra.com');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin_001',
        email: 'admin@cleopatra.com',
        name: 'Administrador',
        role: 'admin',
        provider: 'email',
        verified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: false,
          theme: 'tech'
        }
      };
      this.users.push(adminUser);
      this.saveToStorage();
    }
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    // Credenciales específicas para admin
    if (email === 'admin@cleopatra.com' && password === 'admin123') {
      let adminUser = this.users.find(u => u.email === email);
      if (!adminUser) {
        // Crear admin si no existe
        adminUser = {
          id: 'admin_001',
          email: 'admin@cleopatra.com',
          name: 'Administrador',
          role: 'admin',
          provider: 'email',
          verified: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            notifications: true,
            newsletter: false,
            theme: 'tech'
          }
        };
        this.users.push(adminUser);
      }
      
      adminUser.lastLogin = new Date().toISOString();
      this.currentUser = adminUser;
      this.saveToStorage();
      return adminUser;
    }
    
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Simular verificación de contraseña para usuarios normales
    if (password.length < 6) {
      throw new Error('Contraseña incorrecta');
    }

    user.lastLogin = new Date().toISOString();
    this.currentUser = user;
    this.saveToStorage();
    
    return user;
  }

  async registerWithEmail(email: string, password: string, name: string): Promise<User> {
    if (this.users.find(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      provider: 'email',
      verified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: true,
        theme: 'gifts'
      }
    };

    this.users.push(user);
    this.currentUser = user;
    this.saveToStorage();
    
    return user;
  }

  async loginWithGoogle(): Promise<User> {
    // Simular login con Google
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'google_' + Date.now(),
          email: 'usuario@gmail.com',
          name: 'Usuario Google',
          avatar: 'https://via.placeholder.com/100',
          role: 'user',
          provider: 'google',
          verified: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            notifications: true,
            newsletter: true,
            theme: 'tech'
          }
        };

        // Verificar si ya existe
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
          existingUser.lastLogin = new Date().toISOString();
          this.currentUser = existingUser;
        } else {
          this.users.push(user);
          this.currentUser = user;
        }
        
        this.saveToStorage();
        resolve(this.currentUser);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('cleopatra_current_user');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('cleopatra_current_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const updatedUser = { ...this.currentUser, ...updates };
    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
    }
    
    this.currentUser = updatedUser;
    this.saveToStorage();
    
    return updatedUser;
  }

  private saveToStorage(): void {
    localStorage.setItem('cleopatra_users', JSON.stringify(this.users));
    if (this.currentUser) {
      localStorage.setItem('cleopatra_current_user', JSON.stringify(this.currentUser));
    }
  }

  private loadFromStorage(): void {
    const storedUsers = localStorage.getItem('cleopatra_users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }

    const storedCurrentUser = localStorage.getItem('cleopatra_current_user');
    if (storedCurrentUser) {
      this.currentUser = JSON.parse(storedCurrentUser);
    }
  }
}

export const authService = new AuthService();