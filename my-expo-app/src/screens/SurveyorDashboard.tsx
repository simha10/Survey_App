import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getLocalSurveys, clearLocalSurveys, getOngoingSurvey, isSurveyInProgress } from '../utils/storage';
import { submitSurvey } from '../services/surveyService';

type Navigation = {
  navigate: (screen: string, params?: any) => void;
};

const Card = ({ title, onPress, disabled, subtitle }: { 
  title: string; 
  onPress: () => void; 
  disabled?: boolean;
  subtitle?: string;
}) => {
  return (
    <TouchableOpacity style={[styles.card, disabled && styles.disabledCard]} onPress={onPress} disabled={disabled}>
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
  }, []);

  const checkOngoingSurvey = async () => {
    try {
      const ongoing = await getOngoingSurvey();
      setOngoingSurvey(ongoing && isSurveyInProgress(ongoing) ? ongoing : null);
    } catch (error) {
      console.error('Error checking ongoing survey:', error);
      setOngoingSurvey(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (surveyType: string) => {
    if (ongoingSurvey) {
      Alert.alert(
        'Ongoing Survey',
        'You have an ongoing survey. Would you like to continue with it or start a new one?',
        [
          {
            text: 'Continue Ongoing',
            onPress: () => navigation.navigate('SurveyIntermediate', {
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
      const localSurveys = await getLocalSurveys();
      if (localSurveys.length === 0) {
        Alert.alert('No Data', 'There are no surveys to sync.');
        setIsSyncing(false);
        return;
      }
      for (const survey of localSurveys) {
        await submitSurvey(survey);
      }
      await clearLocalSurveys();
      setOngoingSurvey(null);
      Alert.alert('Success', 'All local surveys have been synced successfully!');
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
      
      {/* Ongoing Survey Alert */}
      {ongoingSurvey && (
        <View style={styles.ongoingSurveyCard}>
          <Text style={styles.ongoingSurveyTitle}>Ongoing Survey</Text>
          <Text style={styles.ongoingSurveyText}>
            You have an ongoing {ongoingSurvey.surveyType} survey
          </Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueOngoing}
          >
            <Text style={styles.continueButtonText}>Continue Survey</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.grid}>
        <Card 
          title="Residential" 
          onPress={() => handleCardPress('Residential')} 
          subtitle={ongoingSurvey ? "Continue ongoing survey first" : "Start new residential survey"}
        />
        <Card 
          title="Non-Residential" 
          onPress={() => handleCardPress('Non-Residential')} 
          subtitle={ongoingSurvey ? "Continue ongoing survey first" : "Start new non-residential survey"}
        />
        <Card 
          title="Mixed" 
          onPress={() => handleCardPress('Mixed')} 
          subtitle={ongoingSurvey ? "Continue ongoing survey first" : "Start new mixed survey"}
        />
        <Card 
          title="Sync Data" 
          onPress={handleSyncData} 
          disabled={isSyncing}
          subtitle={isSyncing ? "Syncing..." : "Sync all surveys to server"}
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
    padding: 16,
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
    marginBottom: 24,
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
  }
});