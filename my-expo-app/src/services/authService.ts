// src/services/authService.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ;

export async function login({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    console.log('Attempting login:', { username, password, role });
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password, role });
    console.log('Login response:', res.data);
    await SecureStore.setItemAsync('authToken', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err: any) {
    console.log('Login error:', err);
    throw err.response?.data?.error || 'Network error, please try again';
  }
}

export async function register(
  data: {
    name: string;
    username: string;
    password: string;
    role: string;
    mobileNumber: string;
  }
) {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
    await SecureStore.deleteItemAsync('authToken');
    await AsyncStorage.removeItem('user');
    return true;
  }
// Optionally, fetch fresh profile data from backend
export async function getProfile() {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      // fallback to cached user
      const cached = await AsyncStorage.getItem('user');
      if (cached) return JSON.parse(cached);
      throw `Failed to load profile ${err}`;
    }
  }