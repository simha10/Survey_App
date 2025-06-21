import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const roles = ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR'];

interface LoginScreenProps {
  setUserRole: (role: string) => void;
}

export default function LoginScreen(props: LoginScreenProps) {
  const { setUserRole } = props;
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const API_BASE_URL = 'http://192.168.18.210:4000'; // Replace with your backend URL and port

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const validate = () => {
    const errs: any = {};
    if (!form.username || form.username.length < 3) errs.username = 'Username required';
    if (!form.password || form.password.length < 8) errs.password = 'Password min 8 chars';
    if (!form.role) errs.role = 'Role required';
    return errs;
  };

  const handleLogin = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      const { token, user } = res.data;
      await SecureStore.setItemAsync('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUserRole(user.role);
      Toast.show({ type: 'success', text1: 'Login successful' });
      navigation.replace('AuthenticatedDrawer');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.response?.data?.error || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <Animated.View
        className="flex-1 p-4 space-y-4 justify-center"
        style={{
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Login
        </Text>
        <View className="flex-row items-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <Feather
            name="at-sign"
            size={20}
            color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            placeholder="Username"
            className="flex-1 p-3 text-lg font-medium text-gray-900 dark:text-gray-100"
            value={form.username}
            onChangeText={(v) => handleChange('username', v)}
            autoCapitalize="none"
            accessibilityLabel="Enter username"
          />
        </View>
        {errors.username && (
          <Text className="text-red-400 text-sm font-medium ml-3">{errors.username}</Text>
        )}
        <View className="flex-row items-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <Feather
            name="lock"
            size={20}
            color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            placeholder="Password"
            className="flex-1 p-3 text-lg font-medium text-gray-900 dark:text-gray-100"
            value={form.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry
            accessibilityLabel="Enter password"
          />
        </View>
        {errors.password && (
          <Text className="text-red-400 text-sm font-medium ml-3">{errors.password}</Text>
        )}
        <View className="flex-row items-center rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <Feather
            name="users"
            size={20}
            color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
            style={{ marginLeft: 12 }}
          />
          <Picker
            selectedValue={form.role}
            onValueChange={(v) => handleChange('role', v)}
            style={{ flex: 1, padding: 12 }}
            accessibilityLabel="Select role"
          >
            <Picker.Item label="Select Role" value="" />
            {roles.map((r) => (
              <Picker.Item key={r} label={r} value={r} />
            ))}
          </Picker>
        </View>
        {errors.role && (
          <Text className="text-red-400 text-sm font-medium ml-3">{errors.role}</Text>
        )}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`rounded-xl p-3 shadow-sm ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
          accessibilityLabel="Login button"
          accessibilityRole="button"
        >
          <Text className="text-center text-lg font-semibold text-white">Login</Text>
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator
            size="large"
            color={theme === 'dark' ? '#e5e7eb' : '#2563eb'}
            className="mt-3"
          />
        )}
        <Toast />
      </Animated.View>
    </SafeAreaView>
  );
}