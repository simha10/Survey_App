import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNav from '../components/SideNav';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import SupervisorDashboard from '../screens/SupervisorDashboard';
import SurveyorDashboard from '../screens/SurveyorDashboard';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AuthenticatedDrawer({ initialRouteName }: { initialRouteName: string }) {
  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerContent={(props) => <SideNav {...props} />}
      screenOptions={({ route }) => ({
        header: () => {
          let title = '';
          switch (route.name) {
            case 'SuperAdminDashboard':
              title = 'Super Admin Dashboard';
              break;
            case 'AdminDashboard':
              title = 'Admin Dashboard';
              break;
            case 'SupervisorDashboard':
              title = 'Supervisor Dashboard';
              break;
            case 'SurveyorDashboard':
              title = 'Surveyor Dashboard';
              break;
            case 'ProfileScreen':
              title = 'Profile';
              break;
            default:
              title = route.name;
          }
          const CustomHeader = require('../components/CustomHeader').default;
          return <CustomHeader title={title} />;
        },
        headerShown: true,
      })}>
      <Drawer.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
      <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
      <Drawer.Screen name="SupervisorDashboard" component={SupervisorDashboard} />
      <Drawer.Screen name="SurveyorDashboard" component={SurveyorDashboard} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('Splash screen timeout, moving to LoginScreen');
      setLoading(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    console.log('Loading is true, showing SplashScreen');
    return <SplashScreen />;
  }

  console.log('Loading is false, showing LoginScreen as initial route');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen">
          {(props: any) => <LoginScreen {...props} setUserRole={setUserRole} />}
        </Stack.Screen>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="AuthenticatedDrawer">
          {(props: any) => (
            <AuthenticatedDrawer
              {...props}
              initialRouteName={
                userRole === 'SUPERADMIN'
                  ? 'SuperAdminDashboard'
                  : userRole === 'ADMIN'
                    ? 'AdminDashboard'
                    : userRole === 'SUPERVISOR'
                      ? 'SupervisorDashboard'
                      : userRole === 'SURVEYOR'
                        ? 'SurveyorDashboard'
                        : 'ProfileScreen'
              }
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
