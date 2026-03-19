import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useCallback } from 'react';

const APP_STATE_KEY = '@ptms_app_state';
const FORM_DATA_KEY = '@ptms_form_data';

interface AppStateData {
  timestamp: number;
  routeName?: string;
  params?: any;
}

/**
 * Hook to manage app state persistence and restoration
 */
export const useAppStatePersistence = () => {
  const appStateRef = useRef(AppState.currentState);
  const lastSaveTimeRef = useRef(0);
  const SAVE_INTERVAL = 5000; // Save every 5 seconds max

  // Save app state to AsyncStorage
  const saveAppState = useCallback(async (routeName?: string, params?: any) => {
    try {
      const now = Date.now();
      
      // Throttle saves to avoid excessive writes
      if (now - lastSaveTimeRef.current < SAVE_INTERVAL) {
        return;
      }
      
      lastSaveTimeRef.current = now;
      
      const stateData: AppStateData = {
        timestamp: now,
        routeName,
        params,
      };
      
      await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(stateData));
      console.log('[AppState] Saved navigation state:', routeName);
    } catch (error) {
      console.error('[AppState] Failed to save state:', error);
    }
  }, []);

  // Restore app state from AsyncStorage
  const restoreAppState = useCallback(async (): Promise<AppStateData | null> => {
    try {
      const savedState = await AsyncStorage.getItem(APP_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as AppStateData;
        
        // Check if state is too old (more than 30 minutes)
        const age = Date.now() - parsed.timestamp;
        const MAX_AGE = 30 * 60 * 1000; // 30 minutes
        
        if (age > MAX_AGE) {
          console.log('[AppState] Saved state too old, clearing');
          await AsyncStorage.removeItem(APP_STATE_KEY);
          return null;
        }
        
        console.log('[AppState] Restored navigation state:', parsed.routeName);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('[AppState] Failed to restore state:', error);
      return null;
    }
  }, []);

  // Clear saved state
  const clearAppState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(APP_STATE_KEY);
      console.log('[AppState] Cleared saved state');
    } catch (error) {
      console.error('[AppState] Failed to clear state:', error);
    }
  }, []);

  // Save form data for auto-recovery
  const saveFormData = useCallback(async (surveyId: string, formData: any) => {
    try {
      const formDataWithMeta = {
        timestamp: Date.now(),
        surveyId,
        data: formData,
      };
      
      await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(formDataWithMeta));
      console.log('[FormData] Auto-saved form data for survey:', surveyId);
    } catch (error) {
      console.error('[FormData] Failed to save form data:', error);
    }
  }, []);

  // Restore form data
  const restoreFormData = useCallback(async (): Promise<any | null> => {
    try {
      const savedData = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Check if data is too old (more than 1 hour)
        const age = Date.now() - parsed.timestamp;
        const MAX_AGE = 60 * 60 * 1000; // 1 hour
        
        if (age > MAX_AGE) {
          console.log('[FormData] Saved data too old, clearing');
          await AsyncStorage.removeItem(FORM_DATA_KEY);
          return null;
        }
        
        console.log('[FormData] Restored form data for survey:', parsed.surveyId);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('[FormData] Failed to restore form data:', error);
      return null;
    }
  }, []);

  // Clear form data after successful save
  const clearFormData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
      console.log('[FormData] Cleared saved form data');
    } catch (error) {
      console.error('[FormData] Failed to clear form data:', error);
    }
  }, []);

  return {
    saveAppState,
    restoreAppState,
    clearAppState,
    saveFormData,
    restoreFormData,
    clearFormData,
  };
};

/**
 * Enhanced hook with automatic background saving
 */
export const useAutoSaveAppState = (navigation?: any) => {
  const { saveAppState } = useAppStatePersistence();
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!navigation) return;

    // Start auto-save interval
    autoSaveIntervalRef.current = setInterval(() => {
      const currentRoute = navigation.getCurrentRoute();
      if (currentRoute) {
        saveAppState(currentRoute.name, currentRoute.params);
      }
    }, 10000); // Save every 10 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [navigation, saveAppState]);

  return useAppStatePersistence();
};

// Export constants for manual use
export { APP_STATE_KEY, FORM_DATA_KEY };
