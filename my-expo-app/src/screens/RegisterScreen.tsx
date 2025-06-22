import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { register } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const roles = ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR'];

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem('user').then((userStr) => {
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || (user.role !== 'SUPERADMIN' && user.role !== 'ADMIN')) {
        Toast.show({ type: 'error', text1: 'Unauthorized' });
        navigation.replace('LoginScreen');
      }
    });
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
    if (!form.name || form.name.length < 3) errs.name = 'Name required (min 3 chars)';
    if (!form.username || form.username.length < 3) errs.username = 'Username required';
    if (!form.password || form.password.length < 8) errs.password = 'Password min 8 chars';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.role) errs.role = 'Role required';
    if (!form.mobileNumber || form.mobileNumber.length !== 10) errs.mobileNumber = 'Mobile number must be 10 digits';
    return errs;
  };

  const handleRegister = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        username: form.username,
        password: form.password,
        role: form.role,
        mobileNumber: form.mobileNumber,
      };
      await register(payload);
      Toast.show({ type: 'success', text1: 'User registered successfully' });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 p-4">
        <Animated.View
          className="space-y-4"
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
          }}>
          <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Register</Text>
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <Feather
              name="user"
              size={20}
              color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
              style={{ marginLeft: 12 }}
            />
            <TextInput
              placeholder="Name"
              className="flex-1 p-3 text-lg font-medium text-gray-900 dark:text-gray-100"
              value={form.name}
              onChangeText={(v) => handleChange('name', v)}
              accessibilityLabel="Enter name"
            />
          </View>
          {errors.name && (
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.name}</Text>
          )}
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.username}</Text>
          )}
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.password}</Text>
          )}
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <Feather
              name="lock"
              size={20}
              color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
              style={{ marginLeft: 12 }}
            />
            <TextInput
              placeholder="Confirm Password"
              className="flex-1 p-3 text-lg font-medium text-gray-900 dark:text-gray-100"
              value={form.confirmPassword}
              onChangeText={(v) => handleChange('confirmPassword', v)}
              secureTextEntry
              accessibilityLabel="Confirm password"
            />
          </View>
          {errors.confirmPassword && (
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.confirmPassword}</Text>
          )}
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
              accessibilityLabel="Select role">
              <Picker.Item label="Select Role" value="" />
              {roles.map((r) => (
                <Picker.Item key={r} label={r} value={r} />
              ))}
            </Picker>
          </View>
          {errors.role && (
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.role}</Text>
          )}
          <View className="flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <Feather
              name="phone"
              size={20}
              color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
              style={{ marginLeft: 12 }}
            />
            <TextInput
              placeholder="Mobile Number"
              className="flex-1 p-3 text-lg font-medium text-gray-900 dark:text-gray-100"
              value={form.mobileNumber}
              onChangeText={(v) => handleChange('mobileNumber', v)}
              keyboardType="phone-pad"
              accessibilityLabel="Enter mobile number"
            />
          </View>
          {errors.mobileNumber && (
            <Text className="ml-3 text-sm font-medium text-red-400">{errors.mobileNumber}</Text>
          )}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className={`rounded-xl p-3 shadow-sm ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            accessibilityLabel="Register button"
            accessibilityRole="button">
            <Text className="text-center text-lg font-semibold text-white">Register</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
