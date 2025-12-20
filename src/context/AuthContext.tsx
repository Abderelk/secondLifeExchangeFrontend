// src/context/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

// Type User complet
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  city?: string;
  postalCode?: string;
  address?: {
    city?: string;
    postalCode?: string;
  };
  role?: 'user' | 'admin' | 'moderator';
  totalExchanges?: number;
  totalItems?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Type pour l'inscription
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Type du contexte
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Optionnel : vérifier le token avec le backend
          // const response = await api.get('/auth/me');
          // setUser(response.data.data);
        } catch (error) {
          console.error('Erreur init auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });

    const { token: newToken, user: userData } = response.data;

    // Formatter l'utilisateur
    const formattedUser: User = {
      id: userData._id || userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avatar: userData.avatar,
      bio: userData.bio,
      city: userData.address?.city || userData.city,
      postalCode: userData.address?.postalCode || userData.postalCode,
      address: userData.address,
      role: userData.role,
      totalExchanges: userData.totalExchanges,
      totalItems: userData.totalItems,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    // Sauvegarder
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(formattedUser));

    setToken(newToken);
    setUser(formattedUser);
  };

  // Register
  const register = async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);

    const { token: newToken, user: userData } = response.data;

    const formattedUser: User = {
      id: userData._id || userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avatar: userData.avatar,
      bio: userData.bio,
      city: userData.address?.city,
      postalCode: userData.address?.postalCode,
      address: userData.address,
      role: userData.role,
      createdAt: userData.createdAt,
    };

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(formattedUser));

    setToken(newToken);
    setUser(formattedUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update user (après modification du profil)
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;