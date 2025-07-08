import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getProfile } from '../services/authService';

interface AuthContextType {
  userRole: string | null;
  isLoading: boolean;
  login: (role: string, token: string, user: object) => Promise<void>;
  logout: () => void;
  getStoredProfile: () => Promise<any>;
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
      // Fetch and store profile in SecureStore
      try {
        const profile = await getProfile();
        await SecureStore.setItemAsync('profile', JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to fetch/store profile in SecureStore', e);
      }
      // Fetch and store surveyor assignment if role is SURVEYOR
      if (role === 'SURVEYOR') {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/surveyor/assigned-mohallas`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const assignment = await response.json();
          await AsyncStorage.setItem('surveyorAssignment', JSON.stringify(assignment));
        }
      }
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      await SecureStore.deleteItemAsync('profile');
      setUserRole(null);
    } catch (e) {
      console.error('Failed to clear user session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, isLoading, login, logout, getStoredProfile }}>
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

// Helper to get profile from SecureStore
const getStoredProfile = async () => {
  try {
    const profileStr = await SecureStore.getItemAsync('profile');
    return profileStr ? JSON.parse(profileStr) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}; 