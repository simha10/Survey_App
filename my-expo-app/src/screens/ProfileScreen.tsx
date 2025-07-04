import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../services/authService';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  // Map role codes to display names
  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      SUPERADMIN: 'Super Admin',
      ADMIN: 'Admin',
      SUPERVISOR: 'Supervisor',
      SURVEYOR: 'Surveyor',
    };
    return roleMap[role] || role;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to load profile' });
        navigation.replace('LoginScreen');
      } finally {
        setLoading(false);
      }
    })();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator
          size="large"
          color={theme === 'dark' ? '#e5e7eb' : '#2563eb'}
          accessibilityLabel="Loading profile"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <Animated.View
        className="flex-1 space-y-4 p-4"
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
        <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</Text>
        <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <View className="space-y-2">
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Name: ${profile?.name || 'Not available'}`}>
              Name: {profile?.name || 'N/A'}
            </Text>
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Username: ${profile?.username || 'Not available'}`}>
              Username: {profile?.username || 'N/A'}
            </Text>
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Mobile: ${profile?.mobileNumber || 'Not available'}`}>
              Mobile: {profile?.mobileNumber || 'N/A'}
            </Text>
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Role: ${profile?.role || 'Not available'}`}>
              Role: {getRoleDisplayName(profile?.role) || 'N/A'}
            </Text>
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Status: ${profile?.isActive ? 'Active' : 'Inactive'}`}>
              Status: {profile?.isActive ? 'Active' : 'Inactive'}
            </Text>
            <Text
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              accessibilityLabel={`Member Since: ${profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}`}>
              Member Since:{' '}
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          disabled={true}
          className="rounded-xl bg-blue-300 p-3 shadow-sm"
          accessibilityLabel="Edit profile (disabled)"
          accessibilityRole="button">
          <Text className="text-center text-lg font-semibold text-white">Edit Profile</Text>
        </TouchableOpacity>
        <Toast />
      </Animated.View>
    </SafeAreaView>
  );
}
