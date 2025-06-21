import React from 'react';
import { View, Text, ActivityIndicator, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen() {
  const { theme } = useTheme();
  const logoScale = React.useRef(new Animated.Value(0.8)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
      <Animated.View
        style={{
          transform: [{ scale: logoScale }],
        }}
      >
        <Image
          source={{ uri: 'https://th.bing.com/th/id/OIP.6lylmlIOykQovO1gVW0SMwHaHx?rs=1&pid=ImgDetMain' }}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
          accessibilityLabel="App logo"
        />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity }}>
        <Text
          className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          accessibilityLabel="App title: LRM Property Survey"
        >
          LRM Property Survey
        </Text>
        <Text
          className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-6"
          accessibilityLabel="Welcome message"
        >
          Welcome!
        </Text>
      </Animated.View>
      <ActivityIndicator
        size="large"
        color={theme === 'dark' ? '#e5e7eb' : '#2563eb'}
        accessibilityLabel="Loading"
      />
    </SafeAreaView>
  );
}