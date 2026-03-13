import React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
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
  }, [animatedValue]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        backgroundColor: theme === 'dark' ? '#2776F5' : '#ffffff',
      }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          gap: 12,
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
        {typeof navigation.openDrawer === 'function' && (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{
              padding: 8,
              borderRadius: 8,
              // Background color for hover/active would usually go here,
              // but we rely on simple styling for the basic state
            }}
            accessibilityLabel="Open navigation drawer"
            accessibilityRole="button">
            <Feather name="menu" size={28} color={theme === 'dark' ? '#ffffff' : '#1f2937'} />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#ffffff' : '#1f2937' }}>
          {title}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default CustomHeader;
