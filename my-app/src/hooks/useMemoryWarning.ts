import { useEffect } from 'react';
import { AppState } from 'react-native';

export const useMemoryWarning = () => {
  useEffect(() => {
    const handleMemoryWarning = () => {
      console.warn('Memory warning received - attempting cleanup');
      
      // Force garbage collection if available
      if (global.gc) {
        try {
          global.gc();
        } catch (e) {
          console.warn('Could not force garbage collection:', e);
        }
      }
      
      // Clear any unnecessary image caches
      // This is app-specific cleanup that can be extended
    };

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        // App is going to background, good time to clean up
        handleMemoryWarning();
      }
    };

    // Listen for app state changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateListener?.remove();
    };
  }, []);
};