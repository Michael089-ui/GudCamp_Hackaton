

import React, { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useData } from './DataContext';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean; // For Admin
  currentUser: User | null; // For regular users
  login: () => void; // Admin login
  userLogin: (email: string, password: string) => boolean;
  userRegister: (userData: Omit<User, 'id' | 'registeredDate'>) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const { users, setUsers } = useData();
  const navigate = useNavigate();

  // Admin login
  const login = () => {
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
  };

  // User login
  const userLogin = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  // User register
  const userRegister = (userData: Omit<User, 'id' | 'registeredDate'>): User | null => {
    const userExists = users.some(u => u.email === userData.email);
    if (userExists) {
        return null;
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        registeredDate: new Date().toISOString().split('T')[0],
        ...userData,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    navigate('/dashboard');
    return newUser;
  };
  
  // Universal logout
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const value = useMemo(() => ({ 
    isAuthenticated, 
    currentUser,
    login, 
    userLogin,
    userRegister,
    logout 
  }), [isAuthenticated, currentUser, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};