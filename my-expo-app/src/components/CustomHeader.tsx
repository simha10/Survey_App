import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <Animated.View
        className="flex-row items-center space-x-3 p-4"
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
        }}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          className="rounded-lg p-2 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          accessibilityLabel="Open navigation drawer"
          accessibilityRole="button">
          <Feather name="menu" size={28} color={theme === 'dark' ? '#ffffff' : '#1f2937'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-white">{title}</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default CustomHeader;
