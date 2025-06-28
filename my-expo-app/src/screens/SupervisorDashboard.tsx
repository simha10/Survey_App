import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  BackHandler,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { fetchSurveyorAssignments } from '../services/surveyService';

export default function SupervisorDashboard() {
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    fetchDashboard();
    return () => subscription.remove();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSurveyorAssignments();
      setDashboard(data);
    } catch (err) {
      setError('Failed to load dashboard');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        <Animated.View
          style={{
            opacity: animatedValue,
            transform: [
              {
                scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }),
              },
            ],
          }}>
          <Text
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            accessibilityLabel="Supervisor Dashboard">
            Supervisor Dashboard
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 24 }} />
          ) : error ? (
            <Text style={{ color: 'red', marginTop: 24 }}>{error}</Text>
          ) : !dashboard || !dashboard.mohallas || dashboard.mohallas.length === 0 ? (
            <Text style={{ color: '#6B7280', marginTop: 24 }}>No assignments for you.</Text>
          ) : (
            <View style={{ marginTop: 24, width: '100%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                Assigned Mohallas
              </Text>
              {dashboard.mohallas.map((m: any, idx: number) => (
                <View
                  key={m.mohallaId || idx}
                  style={{
                    backgroundColor: '#E0E7FF',
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{ fontWeight: 'bold' }}>Mohalla: {m.mohallaName}</Text>
                  <Text>Surveyors:</Text>
                  {m.surveyors.length === 0 ? (
                    <Text style={{ color: '#6B7280' }}>No surveyors assigned.</Text>
                  ) : (
                    m.surveyors.map((s: any, sidx: number) => (
                      <Text key={s.userId || sidx} style={{ marginLeft: 8 }}>
                        - {s.name || s.username}
                      </Text>
                    ))
                  )}
                  <Text>Survey Count: {m.surveyCount}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
