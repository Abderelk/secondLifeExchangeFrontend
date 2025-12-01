// src/context/AuthContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/authService';
import { AxiosError } from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    user: User | null;
    token: string | null;
    loading: boolean;
  }>(() => {
    // Initialisation synchrone depuis localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken,
      loading: false
    };
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setState({
          user: response.user,
          token: response.token,
          loading: false
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(axiosError.response?.data?.message || 'Erreur de connexion');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setState({
          user: response.user,
          token: response.token,
          loading: false
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(axiosError.response?.data?.message || "Erreur d'inscription");
    }
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        login,
        register,
        logout,
        isAuthenticated: !!state.token,
        loading: state.loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};