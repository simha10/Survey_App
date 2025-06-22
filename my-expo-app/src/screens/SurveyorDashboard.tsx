import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getLocalSurveys, clearLocalSurveys } from '../utils/storage';
import { submitSurvey } from '../services/surveyService';

type Navigation = {
  navigate: (screen: string, params: { surveyType: string }) => void;
};

const Card = ({ title, onPress, disabled }: { title: string; onPress: () => void, disabled?: boolean }) => {
  return (
    <TouchableOpacity style={[styles.card, disabled && styles.disabledCard]} onPress={onPress} disabled={disabled}>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function SurveyorDashboard() {
  const navigation = useNavigation<Navigation>();
  const [isSyncing, setIsSyncing] = useState(false);

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

      return () => subscription.remove();
    }, [])
  );

  const handleCardPress = (surveyType: string) => {
    navigation.navigate('AddSurveyForm', { surveyType });
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const localSurveys = await getLocalSurveys();
      if (localSurveys.length === 0) {
        Alert.alert('No Data', 'There are no surveys to sync.');
        return;
      }

      // This should ideally be a more robust queue system
      for (const survey of localSurveys) {
        await submitSurvey(survey);
      }

      await clearLocalSurveys();
      Alert.alert('Success', 'All local surveys have been synced successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Sync Error', 'An error occurred while syncing data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Survey Dashboard</Text>
      <View style={styles.grid}>
        <Card title="Residential" onPress={() => handleCardPress('Residential')} />
        <Card title="Non-Residential" onPress={() => handleCardPress('Non-Residential')} />
        <Card title="Mixed" onPress={() => handleCardPress('Mixed')} />
        <Card title="Sync Data" onPress={handleSyncData} disabled={isSyncing} />
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
    backgroundColor: '#F3F4F6', // light gray
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111827', // dark gray
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
    backgroundColor: '#E5E7EB', // gray-200
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937', // medium gray
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