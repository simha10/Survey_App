import React from 'react';
import { View, Text, ActivityIndicator, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function SplashScreen() {
  const { theme } = useTheme();
  const logoScale = React.useRef(new Animated.Value(0.8)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<any>>();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 3000,
        delay: 2000,
        useNativeDriver: true,
      }),
    ]).start();
    const timeout = setTimeout(async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthenticatedDrawer' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [logoScale, textOpacity, navigation]);

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        {/* Logo Container */}
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 120,
              height: 120,
              marginBottom: 12,
              resizeMode: 'contain',
              alignSelf: 'center',
              transform: [{ scale: 1.2 }],
            }}
            accessibilityLabel="App logo"
          />
        </View>
        {/* Welcome Message Container */}
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            marginTop: 8,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              marginBottom: 0,
              textAlign: 'center',
            }}>
            Welcome to Property Tax
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              marginBottom: 8,
              textAlign: 'center',
            }}>
            Management System
          </Text>
          <ActivityIndicator
            size="large"
            color={theme === 'dark' ? '#e5e7eb' : '#2563eb'}
            style={{ marginTop: 16 }}
            accessibilityLabel="Loading"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
