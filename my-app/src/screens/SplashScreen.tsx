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
  const [error, setError] = React.useState<string | null>(null);

  console.log('[SplashScreen] Rendering, theme:', theme);

  // Debug: Force light theme colors to test visibility
  const testColor = '#111827'; // Always use dark color for testing

  React.useEffect(() => {
    console.log('[SplashScreen] useEffect mounted');
    try {
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
        try {
          console.log('[SplashScreen] Checking token...');
          const token = await AsyncStorage.getItem('userToken');
          console.log('[SplashScreen] Token found:', !!token);
          
          if (token) {
            console.log('[SplashScreen] Navigating to AuthenticatedDrawer');
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthenticatedDrawer' }],
            });
          } else {
            console.log('[SplashScreen] Navigating to LoginScreen');
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }
        } catch (navError) {
          console.error('SplashScreen navigation error:', navError);
          setError('Navigation failed. Please restart the app.');
          // Try fallback to login screen on error
          try {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          } catch (fallbackError) {
            console.error('Fallback navigation also failed:', fallbackError);
          }
        }
      }, 3000);
      
      return () => {
        console.log('[SplashScreen] useEffect cleanup');
        clearTimeout(timeout);
        logoScale.stopAnimation();
        textOpacity.stopAnimation();
      };
    } catch (err) {
      console.error('SplashScreen useEffect error:', err);
      setError('An error occurred. Please restart the app.');
    }
  }, [logoScale, textOpacity, navigation]);

  if (error) {
    console.log('[SplashScreen] Showing error state');
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-white">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
            Error Loading App
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log('[SplashScreen] Rendering normal UI');
  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff' }}>
        {/* Logo Container */}
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#f0f0f0' }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 120,
              height: 120,
              marginBottom: 12,
              resizeMode: 'contain',
              alignSelf: 'center',
              transform: [{ scale: 1.2 }],
              backgroundColor: '#fff',
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
              color: testColor,
              marginBottom: 0,
              textAlign: 'center',
            }}>
            Welcome to Property Tax
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: testColor,
              marginBottom: 8,
              textAlign: 'center',
            }}>
            Management System
          </Text>
          <ActivityIndicator
            size="large"
            style={{ marginTop: 16 }}
            accessibilityLabel="Loading"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
