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
          const parsed = JSON.parse(storedUser);
          setUserRole(parsed.role);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
        // Clear potentially corrupted data
        try {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('userToken');
        } catch (clearError) {
          console.error('Failed to clear corrupted user data', clearError);
        }
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
      
      // Fetch and store profile in SecureStore with error handling
      try {
        const profile = await getProfile();
        await SecureStore.setItemAsync('profile', JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to fetch/store profile in SecureStore', e);
        // Don't fail login if profile fetch fails
      }
      
      // Fetch and store surveyor assignment if role is SURVEYOR
      if (role === 'SURVEYOR') {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/surveyor/assigned-mohallas`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          if (response.ok) {
            const assignment = await response.json();
            await AsyncStorage.setItem('surveyorAssignment', JSON.stringify(assignment));
          } else {
            console.warn('Failed to fetch surveyor assignment:', response.status, response.statusText);
          }
        } catch (assignmentError) {
          console.error('Error fetching surveyor assignment:', assignmentError);
          // Don't fail login if assignment fetch fails
        }
      }
    } catch (e) {
      console.error('Failed to save user session', e);
      throw e; // Re-throw to allow caller to handle
    }
  };

  const logout = async () => {
    try {
      // Clear user role first to update UI immediately
      setUserRole(null);
      
      // Then clear storage
      await Promise.allSettled([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('surveyorAssignment'),
        SecureStore.deleteItemAsync('profile'),
      ]);
      
    } catch (e) {
      console.error('Failed to clear user session', e);
      // Even if clearing fails, ensure user role is null
      setUserRole(null);
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
