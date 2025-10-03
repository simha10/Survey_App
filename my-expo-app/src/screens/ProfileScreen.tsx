import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
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
  const { getStoredProfile } = useAuth();

  // Map role codes to display names
  const getRoleDisplayName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      SUPERADMIN: 'Super Admin',
      ADMIN: 'Admin',
      SUPERVISOR: 'Supervisor',
      SURVEYOR: 'Surveyor',
    };
    return roleMap[role] || role;
  };

  // Helper to format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getStoredProfile();
        if (!data) {
          navigation.replace('LoginScreen');
          return;
        }
        setProfile(data);
      } catch (err) {
        console.error(err);
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
  }, [animatedValue, navigation, getStoredProfile]);

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
              accessibilityLabel={`Member Since: ${profile?.createdAt ? formatDate(profile.createdAt) : 'Not available'}`}>
              Member Since: {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
            </Text>
          </View>
        </View>
        <Toast />
      </Animated.View>
    </SafeAreaView>
  );
}
