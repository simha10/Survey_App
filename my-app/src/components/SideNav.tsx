import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const menuConfig = [
  { label: 'Dashboard', route: 'Dashboard', icon: 'home' },
  { label: 'Profile', route: 'ProfileScreen', icon: 'user' },
];

export default function SideNav(props: DrawerContentComponentProps) {
  const { logout } = useAuth();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem('user').then((userStr) => {
      setUser(userStr ? JSON.parse(userStr) : null);
    });
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const navigateToDashboard = () => {
    if (!user) return;
    switch (user.role) {
      case 'SUPERADMIN':
        props.navigation.navigate('SuperAdminDashboard');
        break;
      case 'ADMIN':
        props.navigation.navigate('AdminDashboard');
        break;
      case 'SUPERVISOR':
        props.navigation.navigate('SupervisorDashboard');
        break;
      case 'SURVEYOR':
        props.navigation.navigate('SurveyorDashboard');
        break;
      default:
        props.navigation.navigate('ProfileScreen');
    }
  };

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out successfully' });
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Animated.View
        style={{
          flex: 1,
          padding: 16,
          paddingTop: 32,
          gap: 12,
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}>
        <View style={{ marginBottom: 24, paddingVertical: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
            {`Hello👋, ${(user as any)?.name || user?.username || 'User'}!`}
          </Text>
        </View>
        {menuConfig.map((item) => (
          <TouchableOpacity
            key={item.route}
            onPress={() =>
              item.route === 'Dashboard'
                ? navigateToDashboard()
                : props.navigation.navigate(item.route)
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            accessibilityLabel={`Navigate to ${item.label}`}
            accessibilityRole="button">
            <Feather name={item.icon as any} size={24} color={'#111827'} />
            <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: '600', color: '#111827' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        {['SUPERADMIN', 'ADMIN'].includes(user?.role ?? '') && (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('RegisterScreen')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            accessibilityLabel="Create a new user"
            accessibilityRole="button">
            <Feather name="user-plus" size={24} color={'#111827'} />
            <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: '600', color: '#111827' }}>Create User</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fee2e2',
            padding: 16,
            borderRadius: 12,
            marginTop: 16,
          }}
          accessibilityLabel="Log out"
          accessibilityRole="button">
          <Feather name="log-out" size={24} color="#ef4444" />
          <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: '600', color: '#ef4444' }}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
