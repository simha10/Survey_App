import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getLocalSurvey, deleteLocalSurvey } from '../utils/storage';
import { submitSurvey } from '../services/surveyService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SurveyData {
  id: string;
  surveyType: 'Residential' | 'Non-Residential' | 'Mixed';
  data: {
    surveyDetails: any;
    propertyDetails: any;
    ownerDetails: any;
    locationDetails: any;
    otherDetails: any;
    residentialPropertyAssessments?: any[];
    nonResidentialPropertyAssessments?: any[];
  };
  createdAt: string;
  synced?: boolean;
}

type Navigation = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  reset: (params: { index: number; routes: { name: string }[] }) => void;
};

export default function SurveyIntermediate() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveyData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadSurveyData();
    }, [])
  );

  const loadSurveyData = async () => {
    try {
      // Get the survey ID from route params or load the latest ongoing survey
      const surveyId = (route.params as any)?.surveyId;
      let survey: SurveyData | null = null;
      
      if (surveyId) {
        const result = await getLocalSurvey(surveyId);
        if (result && !Array.isArray(result)) {
          survey = result;
        }
      } else {
        // Load the latest ongoing survey
        const result = await getLocalSurvey();
        if (Array.isArray(result)) {
          survey = result.find((s: SurveyData) => !s.synced) || null;
        }
      }
      
      setSurveyData(survey);
    } catch (error) {
      console.error('Error loading survey data:', error);
      Alert.alert('Error', 'Failed to load survey data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSurvey = () => {
    if (!surveyData) return;
    navigation.navigate('SurveyForm', { 
      surveyType: surveyData.surveyType,
      editMode: true,
      surveyData: surveyData.data 
    });
  };

  const handleDeleteSurvey = () => {
    if (!surveyData) return;
    
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to delete this survey? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLocalSurvey(surveyData.id);
              Alert.alert('Success', 'Survey deleted successfully', [
                { text: 'OK', onPress: () => {
                  navigation.goBack();
                }}
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete survey');
            }
          }
        }
      ]
    );
  };

  const handleSubmitSurvey = () => {
    if (!surveyData) return;
    
    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit this survey? This will sync the data to the server.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              // The service now handles token retrieval internally
              await submitSurvey(surveyData);

              // Then delete locally
              await deleteLocalSurvey(surveyData.id);

              Alert.alert('Success', 'Survey submitted successfully', [
                { text: 'OK', onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      { name: 'SurveyorDashboard' }
                    ],
                  });
                }}
              ]);
            } catch (error: any) {
              // Check for specific auth error from the service
              if (error.message === 'No auth token found') {
                Alert.alert('Error', 'You are not logged in. Please log in to submit.');
              } else {
                Alert.alert('Error', 'Failed to submit survey');
              }
            }
          }
        }
      ]
    );
  };

  const handleAddResidentialFloor = () => {
    if (!surveyData) return;
    navigation.navigate('ResidentialIntermediate', { 
      surveyId: surveyData.id,
      surveyType: surveyData.surveyType 
    });
  };

  const handleAddNonResidentialFloor = () => {
    if (!surveyData) return;
    navigation.navigate('NonResidentialIntermediate', { 
      surveyId: surveyData.id,
      surveyType: surveyData.surveyType 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading survey data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!surveyData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No survey data found</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const residentialFloorCount = surveyData.data && surveyData.data.residentialPropertyAssessments ? surveyData.data.residentialPropertyAssessments.length : 0;
  const nonResidentialFloorCount = surveyData.data && surveyData.data.nonResidentialPropertyAssessments ? surveyData.data.nonResidentialPropertyAssessments.length : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Survey Summary</Text>
        
        {/* Survey Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Survey Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Survey Type:</Text>
            <Text style={styles.value}>{surveyData.surveyType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>GIS ID:</Text>
            <Text style={styles.value}>{surveyData.data.surveyDetails?.gisId || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Respondent:</Text>
            <Text style={styles.value}>{surveyData.data.propertyDetails?.respondentName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Owner:</Text>
            <Text style={styles.value}>{surveyData.data.ownerDetails?.ownerName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>
              {new Date(surveyData.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Floor Details Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor Details</Text>
          {(surveyData.surveyType === 'Residential' || surveyData.surveyType === 'Mixed') && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Residential Floors:</Text>
              <Text style={styles.value}>{residentialFloorCount}</Text>
            </View>
          )}
          {(surveyData.surveyType === 'Non-Residential' || surveyData.surveyType === 'Mixed') && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Non-Residential Floors:</Text>
              <Text style={styles.value}>{nonResidentialFloorCount}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditSurvey}>
            <Text style={styles.actionButtonText}>Edit Survey</Text>
          </TouchableOpacity>

          {/* Floor Details Buttons */}
          {(surveyData.surveyType === 'Residential' || surveyData.surveyType === 'Mixed') && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleAddResidentialFloor}
            >
              <Text style={styles.actionButtonText}>
                Add Residential Floor Details ({residentialFloorCount})
              </Text>
            </TouchableOpacity>
          )}

          {(surveyData.surveyType === 'Non-Residential' || surveyData.surveyType === 'Mixed') && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleAddNonResidentialFloor}
            >
              <Text style={styles.actionButtonText}>
                Add Non-Residential Floor Details ({nonResidentialFloorCount})
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteSurvey}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete Survey
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.submitButton]} 
            onPress={handleSubmitSurvey}
          >
            <Text style={[styles.actionButtonText, styles.submitButtonText]}>
              Submit Survey
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    padding: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: 'white',
  },
  submitSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  submitButtonText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 