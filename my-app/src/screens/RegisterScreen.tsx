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
  BackHandler,
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

    // Custom hardware back handler
    const onBackPress = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthenticatedDrawer' }],
      });
      return true; // Prevent default behavior
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
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
    if (!form.mobileNumber || form.mobileNumber.length !== 10)
      errs.mobileNumber = 'Mobile number must be 10 digits';
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

      // Get current user's role to navigate to appropriate dashboard
      const userStr = await AsyncStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      setTimeout(() => {
        // Reset navigation stack and navigate to AuthenticatedDrawer
        // The AuthenticatedDrawer will automatically show the correct dashboard based on user role
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthenticatedDrawer' }],
        });
      }, 1500);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={{ flex: 1, backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Animated.View
          style={{
            gap: 16,
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
          <Text style={{ marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: theme === 'dark' ? '#93c5fd' : '#1e3a8a' }}>
            Register
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="user" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <TextInput
                placeholder="Name"
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#9ca3af'}
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: theme === 'dark' ? '#f3f4f6' : '#111827',
                }}
                value={form.name}
                onChangeText={(v) => handleChange('name', v)}
                accessibilityLabel="Enter name"
              />
            </View>
            {errors.name && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.name}</Text>
            )}
          </View>
          
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="at-sign" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <TextInput
                placeholder="Username"
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#9ca3af'}
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: theme === 'dark' ? '#f3f4f6' : '#111827',
                }}
                value={form.username}
                onChangeText={(v) => handleChange('username', v)}
                autoCapitalize="none"
                accessibilityLabel="Enter username"
              />
            </View>
            {errors.username && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.username}</Text>
            )}
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="lock" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#9ca3af'}
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: theme === 'dark' ? '#f3f4f6' : '#111827',
                }}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                secureTextEntry
                accessibilityLabel="Enter password"
              />
            </View>
            {errors.password && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.password}</Text>
            )}
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="lock" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#9ca3af'}
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: theme === 'dark' ? '#f3f4f6' : '#111827',
                }}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange('confirmPassword', v)}
                secureTextEntry
                accessibilityLabel="Confirm password"
              />
            </View>
            {errors.confirmPassword && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.confirmPassword}</Text>
            )}
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="users" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Picker
                  selectedValue={form.role}
                  onValueChange={(v) => handleChange('role', v)}
                  style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}
                  dropdownIconColor={theme === 'dark' ? '#f3f4f6' : '#111827'}
                  accessibilityLabel="Select role">
                  <Picker.Item label="Select Role" value="" />
                  {roles.map((r) => (
                    <Picker.Item key={r} label={r} value={r} />
                  ))}
                </Picker>
              </View>
            </View>
            {errors.role && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.role}</Text>
            )}
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                paddingHorizontal: 12,
                height: 50,
              }}>
              <Feather name="phone" size={20} color={theme === 'dark' ? '#d1d5db' : '#6b7280'} />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#9ca3af'}
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: theme === 'dark' ? '#f3f4f6' : '#111827',
                }}
                value={form.mobileNumber}
                onChangeText={(v) => handleChange('mobileNumber', v)}
                keyboardType="phone-pad"
                accessibilityLabel="Enter mobile number"
              />
            </View>
            {errors.mobileNumber && (
              <Text style={{ marginTop: 4, marginLeft: 12, fontSize: 13, color: '#f87171' }}>{errors.mobileNumber}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              marginTop: 8,
              width: '100%',
              borderRadius: 12,
              paddingVertical: 14,
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              alignItems: 'center',
            }}
            accessibilityLabel="Register button"
            accessibilityRole="button">
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 }}>Register</Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator
              size="large"
              color={theme === 'dark' ? '#d1d5db' : '#2563eb'}
              style={{ marginTop: 12 }}
            />
          )}

          <Toast />
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
