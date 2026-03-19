import React from "react";
import { View, Text, StyleSheet, Platform, AppState, AppStateStatus } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { migrateUserObject } from "./src/utils/storage";
import { initializeDatabase } from "./src/services/sqlite";
import { useMemoryWarning } from "./src/hooks/useMemoryWarning";
import { useAppStatePersistence } from "./src/hooks/useAppStatePersistence";
import SplashScreen from "./src/screens/SplashScreen";

// global styles for native and web (tailwind utilities)
import "./index.css";

// Import optional native-only components
let SafeAreaProvider: React.ComponentType<{ children: React.ReactNode }> | null = null;
let GestureHandlerRootView: React.ComponentType<{ children: React.ReactNode; style?: any }> | null = null;

if (Platform.OS !== 'web') {
  try {
    SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
    GestureHandlerRootView = require('react-native-gesture-handler').GestureHandlerRootView;
  } catch (e) {
    console.warn('Native modules not available:', e);
  }
}

// Fallback wrapper for web
const SafeWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === 'web' || !SafeAreaProvider) {
    return <>{children}</>;
  }
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

const GestureWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === 'web' || !GestureHandlerRootView) {
    return <>{children}</>;
  }
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            The app encountered an unexpected error. Please restart the app.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              {this.state.error.toString()}
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  errorDetails: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
});

function AppContent() {
  const { theme } = useTheme();
  const [isReady, setIsReady] = React.useState(false);
  const [initError, setInitError] = React.useState<Error | null>(null);
  const appStateRef = React.useRef(AppState.currentState);
  const { restoreAppState, clearAppState } = useAppStatePersistence();

  // Add memory warning hook
  useMemoryWarning();

  // Handle app state changes (background/foreground)
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('[AppState] Changed from:', appStateRef.current, 'to:', nextAppState);
      
      // App is going to background - save state
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('[AppState] App returning to foreground');
        // Could trigger state restoration here if needed
      }
      
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    console.log('[AppContent] Starting initialization...');
    const prepare = async () => {
      try {
        console.log('[AppContent] Running initialization tasks in parallel...');
        // Run initialization AND a minimum splash delay in parallel
        await Promise.all([
          (async () => {
            try {
              console.log('[AppContent] Initializing database...');
              await initializeDatabase();
              console.log('[AppContent] Database initialized successfully');
            } catch (dbError) {
              console.error('Database initialization failed:', dbError);
              console.error('Stack trace:', dbError instanceof Error ? dbError.stack : 'No stack');
              // Continue even if DB fails - we can work without SQLite
            }
            try {
              console.log('[AppContent] Migrating user object...');
              await migrateUserObject();
              console.log('[AppContent] User migration completed');
            } catch (migrateError) {
              console.error('User migration failed:', migrateError);
              // Continue even if migration fails
            }
            console.log('[AppContent] Async initialization tasks finished');
          })(),
          new Promise((resolve) => {
            console.log('[AppContent] Starting splash delay timer (2.5s)...');
            setTimeout(() => {
              console.log('[AppContent] Splash delay timer finished');
              resolve(true);
            }, 2500);
          }), // minimum 2.5s splash
        ]);
        
        // Check for saved app state or recovery data after initialization
        console.log('[AppContent] Checking for recovery data...');
        const savedState = await restoreAppState();
        if (savedState) {
          console.log('[AppContent] Found saved state, could restore to:', savedState.routeName);
          // Future: Could navigate to saved state here
        }
        
        console.log('[AppContent] All initialization tasks completed, setting isReady=true');
        setIsReady(true);
      } catch (error) {
        console.error("App initialization failed:", error);
        setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
        setIsReady(true); // Show error instead of blank screen
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    console.log('[AppContent] Not ready yet, returning null');
    return null; // Don't render SplashScreen here - let AppNavigator handle it
  }

  if (initError) {
    console.log('[AppContent] Showing initialization error screen');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Failed</Text>
        <Text style={styles.errorText}>
          The app encountered an initialization error. Some features may not work properly.
        </Text>
        {__DEV__ && (
          <Text style={styles.errorDetails}>{initError.toString()}</Text>
        )}
      </View>
    );
  }

  console.log('[AppContent] Rendering AppNavigator');
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureWrapper>
        <SafeWrapper>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </SafeWrapper>
      </GestureWrapper>
    </ErrorBoundary>
  );
}
