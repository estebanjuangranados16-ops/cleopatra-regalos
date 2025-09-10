export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  provider: 'email' | 'google';
  verified: boolean;
  createdAt: string;
  lastLogin: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'gifts' | 'tech';
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}