// src/services/authService.ts
import api from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    console.log('Attempting login:', { username, password, role });
    const res = await api.post('/auth/login', { username, password, role });
    console.log('Login response:', res.data);
    await AsyncStorage.setItem('userToken', res.data.token);
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
    const token = await AsyncStorage.getItem('userToken');
    const res = await api.post(
      '/auth/register',
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
    await AsyncStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    // fallback to cached user
    const cached = await AsyncStorage.getItem('user');
    if (cached) return JSON.parse(cached);
    throw `Failed to load profile ${err}`;
  }
}
