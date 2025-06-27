import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

interface AuthContextType {
  userRole: string | null;
  isLoading: boolean;
  login: (role: string, token: string, user: object) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserRole(JSON.parse(storedUser).role);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (role: string, token: string, user: object) => {
    try {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify({ ...user, role }));
        setUserRole(role);
    } catch (e) {
        console.error('Failed to save user session', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      setUserRole(null);
    } catch (e) {
        console.error('Failed to clear user session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 