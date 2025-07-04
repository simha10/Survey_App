import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getUnsyncedSurveys,
  syncSurveysToBackend,
  getSelectedAssignment,
  setSelectedAssignment,
} from '../utils/storage';
import { fetchSurveyorAssignments } from '../services/surveyService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Navigation = {
  navigate: (screen: string, params?: any) => void;
};

const Card = ({
  title,
  onPress,
  disabled,
  subtitle,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  subtitle?: string;
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabledCard]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.cardText}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtext}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

export default function SurveyorDashboard() {
  const navigation = useNavigation<Navigation>();
  const [isSyncing, setIsSyncing] = useState(false);
  const [ongoingSurvey, setOngoingSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [primaryAssignment, setPrimaryAssignment] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
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

      // Always re-check for ongoing survey on focus
      checkOngoingSurvey();

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    checkOngoingSurvey();
    fetchAssignments();
    loadPrimaryAssignment();
  }, []);

  const checkOngoingSurvey = async () => {
    try {
      const allSurveys = await getUnsyncedSurveys();
      // Only show ongoing if there is a survey that is not yet submitted
      const ongoing = Array.isArray(allSurveys)
        ? allSurveys.find((s: any) => (s.status === 'incomplete'))
        : null;
      setOngoingSurvey(ongoing && ongoing.surveyType ? ongoing : null);
    } catch (error) {
      console.error('Error checking ongoing survey:', error);
      setOngoingSurvey(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const data = await fetchSurveyorAssignments();
      setAssignments(data.assignments || []);
    } catch (err: any) {
      setAssignmentsError('Failed to load assignments');
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const loadPrimaryAssignment = async () => {
    const json = await AsyncStorage.getItem('primaryAssignment');
    if (json) setPrimaryAssignment(JSON.parse(json));
  };

  const handleSetPrimary = async (assignment: any) => {
    await AsyncStorage.setItem('primaryAssignment', JSON.stringify(assignment));
    setPrimaryAssignment(assignment);
    await setSelectedAssignment(assignment); // keep selectedAssignment in sync
    Alert.alert('Primary Assignment Set', 'This assignment is now your primary.');
  };

  const handleCardPress = (surveyType: string) => {
    if (ongoingSurvey) {
      Alert.alert(
        'Ongoing Survey',
        'You have an ongoing survey. Would you like to continue with it or start a new one?',
        [
          {
            text: 'Continue Ongoing',
            onPress: () =>
              navigation.navigate('SurveyIntermediate', {
                surveyId: ongoingSurvey.id,
                surveyType: ongoingSurvey.surveyType,
              }),
          },
          {
            text: 'Start New',
            onPress: () => navigation.navigate('SurveyForm', { surveyType }),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      navigation.navigate('SurveyForm', { surveyType });
    }
  };

  const handleContinueOngoing = () => {
    if (ongoingSurvey) {
      navigation.navigate('SurveyIntermediate', {
        surveyId: ongoingSurvey.id,
        surveyType: ongoingSurvey.surveyType,
      });
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
      const token = await AsyncStorage.getItem('userToken');
      if (!apiBaseUrl || !token) {
        Alert.alert('Error', 'Missing API base URL or auth token.');
        setIsSyncing(false);
        return;
      }
      const unsynced = await getUnsyncedSurveys();
      if (unsynced.length === 0) {
        Alert.alert('No Data', 'There are no surveys to sync.');
        setIsSyncing(false);
        return;
      }
      const { success, failed } = await syncSurveysToBackend(apiBaseUrl, token);
      let msg = `${success} survey(s) synced successfully.`;
      if (failed > 0) msg += ` ${failed} failed.`;
      Alert.alert('Sync Complete', msg);
      setOngoingSurvey(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Sync Error', 'An error occurred while syncing data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Survey Dashboard</Text>

      {/* Assignments Section */}
      <View className="mb-4">
        <Text className="mb-2 text-lg font-bold">Your Assignment</Text>
        {assignmentsLoading ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <View className="w-full">
            {assignmentsError ? (
              <View className="mb-2 items-center rounded-lg bg-red-100 p-4">
                <Text className="font-semibold text-red-700">{assignmentsError}</Text>
              </View>
            ) : assignments.length === 0 ? (
              <View className="mb-2 items-center rounded-lg bg-yellow-100 p-4">
                <Text className="text-yellow-700">No assignments for you.</Text>
              </View>
            ) : (
              assignments.map((a, idx) => (
                <View key={a.assignmentId || idx} className="mb-2 rounded-lg bg-indigo-100 p-4" style={{ position: 'relative' }}>
                  {/* Primary Button Top Right */}
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: primaryAssignment && a.assignmentId === primaryAssignment.assignmentId ? '#22c55e' : '#3b82f6',
                      paddingVertical: 4,
                      paddingHorizontal: 12,
                      borderRadius: 16,
                      zIndex: 10,
                    }}
                    onPress={() => handleSetPrimary(a)}
                    disabled={primaryAssignment && a.assignmentId === primaryAssignment.assignmentId}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                      Primary
                    </Text>
                  </TouchableOpacity>
                  <Text>
                    <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>ULB: </Text>
                    <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{a.ulb?.ulbName || a.ulb?.ulbId || 'N/A'}</Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>Zone: </Text>
                    <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{a.zone?.zoneName || a.zone?.zoneId || 'N/A'}</Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>Ward: </Text>
                    <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{a.ward?.wardName || a.ward?.wardId || 'N/A'}</Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>Mohallas: </Text>
                    <Text style={{ color: '#3b82f6', fontWeight: '600' }}>{a.mohallas && a.mohallas.length > 0 ? a.mohallas.map((m: any) => m.mohallaName).join(', ') : 'N/A'}</Text>
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* Ongoing Survey Alert */}
      {ongoingSurvey && (
        <View style={styles.ongoingSurveyCard}>
          <Text style={styles.ongoingSurveyTitle}>Ongoing Survey</Text>
          <Text style={styles.ongoingSurveyText}>
            You have an ongoing {ongoingSurvey.surveyType} survey
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueOngoing}>
            <Text style={styles.continueButtonText}>Continue Survey</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.grid}>
        <Card
          title="Residential"
          onPress={() => handleCardPress('Residential')}
          subtitle={
            ongoingSurvey ? 'Continue ongoing survey first' : 'Start new residential survey'
          }
        />
        <Card
          title="Non-Residential"
          onPress={() => handleCardPress('Non-Residential')}
          subtitle={
            ongoingSurvey ? 'Continue ongoing survey first' : 'Start new non-residential survey'
          }
        />
        <Card
          title="Mixed"
          onPress={() => handleCardPress('Mixed')}
          subtitle={ongoingSurvey ? 'Continue ongoing survey first' : 'Start new mixed survey'}
        />
        <Card
          title="Sync Data"
          onPress={handleSyncData}
          disabled={isSyncing}
          subtitle={isSyncing ? 'Syncing...' : 'Sync all surveys to server'}
        />
      </View>

      {isSyncing && (
        <View style={styles.syncingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.syncingText}>Syncing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 0,
    textAlign: 'center',
    color: '#111827',
  },
  ongoingSurveyCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  ongoingSurveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  ongoingSurveyText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: '#E5E7EB',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  cardSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  syncingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});
