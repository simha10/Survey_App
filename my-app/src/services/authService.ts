// src/services/authService.ts
import api from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export async function login({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}) {
  try {
    console.log('Attempting login:', { username, password, role });
    const res = await api.post('/auth/login', { username, password, role });
    console.log('Login response:', res.data);
    await AsyncStorage.setItem('userToken', res.data.token);
    // Normalize user object to have both id and userId
    const normalizedUser = {
      ...res.data.user,
      id: res.data.userId || res.data.user?.id,
      userId: res.data.userId || res.data.user?.id,
    };
    await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
    // Fetch and store latest profile after login
    try {
      const profileRes = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });
      const normalizedProfile = {
        ...profileRes.data,
        id: profileRes.data.userId || profileRes.data.id,
        userId: profileRes.data.userId || profileRes.data.id,
      };
      await AsyncStorage.setItem('user', JSON.stringify(normalizedProfile));
    } catch (profileErr) {
      // If profile fetch fails, keep the login user data
      console.warn('Failed to fetch latest profile after login:', profileErr);
    }
    return res.data.user;
  } catch (err: any) {
    console.log('Login error:', err);
    throw err.response?.data?.error || 'Network error, please try again';
  }
}

export async function register(data: {
  name: string;
  username: string;
  password: string;
  role: string;
  mobileNumber: string;
}) {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await api.post('/auth/register', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.error || 'Network error, please try again';
  }
}

// Mock dropdown data if backend not ready
export async function getWardMohallaOptions() {
  // Replace with real API call if available
  return [
    { id: 'uuid-mohalla-1', name: 'Mohalla 1' },
    { id: 'uuid-mohalla-2', name: 'Mohalla 2' },
  ];
}
export async function getZoneWardOptions() {
  return [
    { id: 'uuid-zone-1', name: 'Zone 1' },
    { id: 'uuid-zone-2', name: 'Zone 2' },
  ];
}
export async function getUlbZoneOptions() {
  return [
    { id: 'uuid-ulb-1', name: 'ULB Zone 1' },
    { id: 'uuid-ulb-2', name: 'ULB Zone 2' },
  ];
}
export async function logout() {
  // Cache last used credentials if available
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.username && user.password && user.role) {
        await SecureStore.setItemAsync('cachedUsername', user.username);
        await SecureStore.setItemAsync('cachedPassword', user.password);
        await SecureStore.setItemAsync('cachedRole', user.role);
      }
    }
  } catch (e) {
    // Ignore errors, do not block logout
  }
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('user');
  return true;
}
// Optionally, fetch fresh profile data from backend
export async function getProfile() {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await api.get('/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const normalizedProfile = {
      ...res.data,
      id: res.data.userId || res.data.id,
      userId: res.data.userId || res.data.id,
    };
    await AsyncStorage.setItem('user', JSON.stringify(normalizedProfile));
    return normalizedProfile;
  } catch (err) {
    // fallback to cached user
    const cached = await AsyncStorage.getItem('user');
    if (cached) return JSON.parse(cached);
    throw `Failed to load profile ${err}`;
  }
}
