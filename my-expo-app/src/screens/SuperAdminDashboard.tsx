import React, { useEffect } from 'react';
import { View, Text, Animated, Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function SuperAdminDashboard() {
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
      <Animated.View
        style={{
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        }}
      >
        <Text
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          accessibilityLabel="Welcome to SuperAdmin Dashboard"
        >
          Welcome to SuperAdmin Dashboard
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
