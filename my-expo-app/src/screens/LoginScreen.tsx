import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '../api/axiosConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { saveMasterData, saveAssignments } from '../utils/storage';
import { fetchAllMasterData } from '../services/masterDataService';
import { fetchSurveyorAssignments } from '../services/surveyService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const roles = ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR'];

export default function LoginScreen() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // Prefill credentials from SecureStore
    (async () => {
      try {
        const cachedUsername = await SecureStore.getItemAsync('cachedUsername');
        const cachedPassword = await SecureStore.getItemAsync('cachedPassword');
        const cachedRole = await SecureStore.getItemAsync('cachedRole');
        setForm((prev) => ({
          ...prev,
          username: typeof cachedUsername === 'string' ? cachedUsername : '',
          password: typeof cachedPassword === 'string' ? cachedPassword : '',
          role: typeof cachedRole === 'string' ? cachedRole : '',
        }));
      } catch (e) {
        console.error('Error retrieving credentials from SecureStore:', e);
        setForm((prev) => ({ ...prev, username: '', password: '', role: '' }));
      }
    })();
  }, [animatedValue]);

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
      const res = await api.post('/auth/login', {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data;
      // Check if selected role matches backend user role
      if (form.role && user.role && form.role.toUpperCase() !== user.role.toUpperCase()) {
        Toast.show({
          type: 'error',
          text1: 'Role Mismatch',
          text2: `You selected "${form.role}", but your account role is "${user.role}". Please select the correct role to continue.`,
        });
        setForm((prev) => ({
          ...prev,
          role: user.role,
        }));
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('userToken', token);
      const masterData = await fetchAllMasterData(token);
      await saveMasterData(masterData);

      if (user.role === 'SURVEYOR') {
        const assignments = await fetchSurveyorAssignments();
        await saveAssignments(assignments);
      }

      // Cache credentials securely
      await SecureStore.setItemAsync('cachedUsername', form.username);
      await SecureStore.setItemAsync('cachedPassword', form.password);
      await SecureStore.setItemAsync('cachedRole', form.role);

      await login(user.role, token, user);
      Toast.show({ type: 'success', text1: 'Login successful' });
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthenticatedDrawer' }],
        });
      }, 1000); // Give Toast a moment to show
    } catch (err: any) {
      console.error('Login error:', err, err?.response, err?.message);
      Toast.show({
        type: 'error',
        text1: err.response?.data?.error || err.message || 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
            borderRadius: 20,
            padding: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
            alignItems: 'center',
          }}>
          {/* Logo */}
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 72, height: 72, marginBottom: 12, resizeMode: 'contain' }}
          />
          <Text className="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Login into your account
          </Text>
          <View className="w-full space-y-5">
            <View className="mb-2 flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
              <Text className="mb-2 ml-3 text-sm font-medium text-red-400">{errors.username}</Text>
            )}
            <View className="mb-2 flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
                secureTextEntry={!showPassword}
                accessibilityLabel="Enter password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ padding: 8, marginRight: 8 }}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme === 'dark' ? '#e5e7eb' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="mb-2 ml-3 text-sm font-medium text-red-400">{errors.password}</Text>
            )}
            <View className="mb-2 flex-row items-center rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
              <Text className="mb-2 ml-3 text-sm font-medium text-red-400">{errors.role}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-4 w-full rounded-xl p-4 shadow-lg ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            accessibilityLabel="Login button"
            accessibilityRole="button">
            <Text className="text-center text-lg font-semibold tracking-wide text-white">
              Login
            </Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator
              size="large"
              color={theme === 'dark' ? '#e5e7eb' : '#2563eb'}
              className="mt-4"
            />
          )}
        </View>
        <Toast />
      </View>
    </SafeAreaView>
  );
}
