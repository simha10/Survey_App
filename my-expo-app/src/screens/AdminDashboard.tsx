import React, { useEffect } from 'react';
import { View, Text, Alert, BackHandler } from 'react-native';

export default function AdminDashboard() {
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

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Welcome to Admin Dashboard</Text>
    </View>
  );
}
