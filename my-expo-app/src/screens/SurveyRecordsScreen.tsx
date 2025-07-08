import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUnsyncedSurveys, getAssignments, removeUnsyncedSurvey, logSyncedSurvey } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';

type Navigation = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

interface SurveyRecord {
  id: string;
  surveyType: string;
  data: {
    surveyDetails?: any;
    propertyDetails?: any;
    locationDetails?: any;
    residentialPropertyAssessments?: any[];
    nonResidentialPropertyAssessments?: any[];
    [key: string]: any;
  };
  createdAt: string;
  synced?: boolean;
  status?: string;
}

const SurveyRecordCard = ({ 
  survey, 
  assignments, 
  onDelete, 
  onSync, 
  isSyncing 
}: { 
  survey: SurveyRecord; 
  assignments: any[];
  onDelete: (surveyId: string) => void;
  onSync: (survey: SurveyRecord) => void;
  isSyncing: boolean;
}) => {
  const getTotalFloorCount = (survey: SurveyRecord) => {
    const residentialCount = survey.data.residentialPropertyAssessments?.length || 0;
    const nonResidentialCount = survey.data.nonResidentialPropertyAssessments?.length || 0;
    return residentialCount + nonResidentialCount;
  };

  const getMohallaName = (survey: SurveyRecord) => {
    // First try to get from locationDetails or surveyDetails (if already resolved)
    const directName = survey.data.locationDetails?.mohallaName || 
                      survey.data.surveyDetails?.mohallaName;
    if (directName) return directName;
    
    // If not found, try to resolve from mohallaId using assignments
    const mohallaId = survey.data.surveyDetails?.mohallaId;
    if (mohallaId && assignments.length > 0) {
      for (const assignment of assignments) {
        if (assignment.mohallas && Array.isArray(assignment.mohallas)) {
          const mohalla = assignment.mohallas.find((m: any) => m.mohallaId === mohallaId);
          if (mohalla) {
            return mohalla.mohallaName;
          }
        }
      }
    }
    
    return 'N/A';
  };

  const getMapId = (survey: SurveyRecord) => {
    return survey.data.surveyDetails?.mapId || 
           survey.data.propertyDetails?.mapId || 
           'N/A';
  };

  const getGisId = (survey: SurveyRecord) => {
    return survey.data.surveyDetails?.gisId || 
           survey.data.propertyDetails?.gisId || 
           'N/A';
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.surveyType}>{survey.surveyType}</Text>
          <Text style={styles.createdDate}>
            {new Date(survey.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.syncButton]}
            onPress={() => onSync(survey)}
            disabled={isSyncing}
          >
            <Text style={styles.actionButtonText}>
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(survey.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mohalla:</Text>
          <Text style={styles.detailValue}>{getMohallaName(survey)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Map ID:</Text>
          <Text style={styles.detailValue}>{getMapId(survey)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>GIS ID:</Text>
          <Text style={styles.detailValue}>{getGisId(survey)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Floors:</Text>
          <Text style={styles.detailValue}>{getTotalFloorCount(survey)}</Text>
        </View>
      </View>
    </View>
  );
};

export default function SurveyRecordsScreen() {
  const navigation = useNavigation<Navigation>();
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [syncingSurveyId, setSyncingSurveyId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      loadSurveyRecords();

      return () => subscription.remove();
    }, [navigation])
  );

  const loadSurveyRecords = async () => {
    try {
      setLoading(true);
      const allSurveys = await getUnsyncedSurveys();
      const assignmentsData = await getAssignments();
      setAssignments(assignmentsData?.assignments || []);
      
      // Filter for submitted but unsynced surveys
      const submittedUnsynced = allSurveys.filter(
        (survey: SurveyRecord) => 
          survey.status === 'submitted' && 
          !survey.synced
      );
      setSurveys(submittedUnsynced);
    } catch (error) {
      console.error('Error loading survey records:', error);
      Alert.alert('Error', 'Failed to load survey records');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteSurvey = (surveyId: string) => {
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to delete this survey? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              'Confirm Deletion',
              'This will permanently delete the survey from your device. Are you absolutely sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await removeUnsyncedSurvey(surveyId);
                      setSurveys(prev => prev.filter(s => s.id !== surveyId));
                      Alert.alert('Success', 'Survey deleted successfully');
                    } catch (error) {
                      console.error('Error deleting survey:', error);
                      Alert.alert('Error', 'Failed to delete survey');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleSyncSurvey = async (survey: SurveyRecord) => {
    Alert.alert(
      'Sync Survey',
      `This will upload the ${survey.surveyType} survey to the server and remove it from your device. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: async () => {
            try {
              setSyncingSurveyId(survey.id);
              const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
              const token = await AsyncStorage.getItem('userToken');
              
              if (!apiBaseUrl || !token) {
                Alert.alert('Error', 'Missing API base URL or auth token.');
                return;
              }

              const res = await api.post('/surveys/addSurvey', survey.data);
              
              if (res.status === 200 || res.status === 201) {
                await removeUnsyncedSurvey(survey.id);
                setSurveys(prev => prev.filter(s => s.id !== survey.id));
                // Log the synced survey for Survey Count
                let userRaw = await AsyncStorage.getItem('user');
                if (!userRaw) userRaw = await AsyncStorage.getItem('userInfo');
                let userId = userRaw ? JSON.parse(userRaw)?.id : null;
                if (userId) {
                  await logSyncedSurvey(survey.id, userId);
                } else {
                  console.log('UserId is null, not logging synced survey:', survey.id);
                }
                Alert.alert('Success', 'Survey synced successfully');
              } else {
                Alert.alert('Error', 'Failed to sync survey to server');
              }
            } catch (error) {
              console.error('Error syncing survey:', error);
              Alert.alert('Error', 'Failed to sync survey. Please try again.');
            } finally {
              setSyncingSurveyId(null);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Unsynced Surveys</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading unsynced surveys...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Unsynced Surveys</Text>
      </View>

      {surveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No submitted surveys found</Text>
          <Text style={styles.emptySubtext}>
            Surveys that are submitted but not yet synced will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SurveyRecordCard 
              survey={item} 
              assignments={assignments}
              onDelete={handleDeleteSurvey}
              onSync={handleSyncSurvey}
              isSyncing={syncingSurveyId === item.id}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  surveyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardContent: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
}); 