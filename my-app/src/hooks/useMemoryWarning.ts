import { useEffect } from 'react';
import { NativeModules, Alert } from 'react-native';

const { ExponentMemoryWarning } = NativeModules;

export const useMemoryWarning = () => {
  useEffect(() => {
    if (!ExponentMemoryWarning) {
      return;
    }

    const listener = ExponentMemoryWarning.addEventListener((warning: any) => {
      console.warn('Memory Warning:', warning);
      Alert.alert(
        'Memory Warning',
        'Your device is running low on memory. Please close some apps to improve performance.',
        [{ text: 'OK' }]
      );
    });

    return () => {
      listener.remove();
    };
  }, []);
};
