import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import SideNav from '../components/SideNav';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import SupervisorDashboard from '../screens/SupervisorDashboard';
import SurveyorDashboard from '../screens/SurveyorDashboard';
import SurveyForm from '../screens/SurveyForm';
import SurveyIntermediate from '../screens/SurveyIntermediate';
import ResidentialIntermediate from '../screens/ResidentialIntermediate';
import NonResidentialIntermediate from '../screens/NonResidentialIntermediate';
import ResidentialFloorDetail from '../screens/ResidentialFloorDetail';
import NonResidentialFloorDetail from '../screens/NonResidentialFloorDetail';
import SurveyRecordsScreen from '../screens/SurveyRecordsScreen';
import SurveyCountScreen from '../screens/SurveyCountScreen';
import { useAuth } from '../context/AuthContext';
import CustomHeader from '../components/CustomHeader';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AuthenticatedDrawer({
  initialRouteName,
  userRole,
}: {
  initialRouteName: string;
  userRole: string | null;
}) {
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
          return <CustomHeader title={title} />;
        },
        headerShown: true,
      })}>
      {/* Role-specific screens */}
      {userRole === 'SUPERADMIN' && (
        <Drawer.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
      )}
      {userRole === 'ADMIN' && <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />}
      {userRole === 'SUPERVISOR' && (
        <Drawer.Screen name="SupervisorDashboard" component={SupervisorDashboard} />
      )}
      {userRole === 'SURVEYOR' && (
        <Drawer.Screen name="SurveyorDashboard" component={SurveyorDashboard} />
      )}

      {/* Common screens */}
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { userRole } = useAuth();
  const { theme } = useTheme();

  return (
    <View key={theme} className={theme === 'dark' ? 'dark flex-1' : 'flex-1'}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="AuthenticatedDrawer" options={{ headerShown: false }}>
            {(props) => {
              // Use param if present, else fallback to userRole
              const initialDashboard =
                (props.route.params as any)?.initialDashboard ||
                (userRole === 'SUPERADMIN'
                  ? 'SuperAdminDashboard'
                  : userRole === 'ADMIN'
                    ? 'AdminDashboard'
                    : userRole === 'SUPERVISOR'
                      ? 'SupervisorDashboard'
                      : userRole === 'SURVEYOR'
                        ? 'SurveyorDashboard'
                        : 'ProfileScreen');
              return (
                <AuthenticatedDrawer
                  {...props}
                  userRole={userRole}
                  initialRouteName={initialDashboard}
                />
              );
            }}
          </Stack.Screen>
          <Stack.Screen name="SurveyForm" component={SurveyForm} options={{ headerShown: false }} />
          <Stack.Screen
            name="SurveyIntermediate"
            component={SurveyIntermediate}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResidentialIntermediate"
            component={ResidentialIntermediate}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NonResidentialIntermediate"
            component={NonResidentialIntermediate}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResidentialFloorDetail"
            component={ResidentialFloorDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NonResidentialFloorDetail"
            component={NonResidentialFloorDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SurveyRecordsScreen"
            component={SurveyRecordsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Create New User" />,
            }}
          />
          <Stack.Screen
            name="SurveyCountScreen"
            component={SurveyCountScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
