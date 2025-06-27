import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getLocalSurvey, updateLocalSurvey } from '../utils/storage';

interface FloorDetail {
  id: string;
  floorNumber: string;
  propertyCategory: string;
  propertySubCategory: string;
  establishmentName: string;
  licenseNo: string;
  licenseExpiryDate: string;
  occupancyStatus: string;
  constructionNature: string;
  builtupArea: string;
}

interface SurveyData {
  id: string;
  surveyType: string;
  data: {
    nonResidentialPropertyAssessments?: FloorDetail[];
    [key: string]: any;
  };
}

type Navigation = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export default function NonResidentialIntermediate() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  const surveyId = route.params?.surveyId;
  const surveyType = route.params?.surveyType;

  useFocusEffect(
    React.useCallback(() => {
      loadSurveyData();
    }, [])
  );

  const loadSurveyData = async () => {
    try {
      if (!surveyId) {
        Alert.alert('Error', 'Survey ID not found');
        navigation.goBack();
        return;
      }

      const survey = await getLocalSurvey(surveyId);
      setSurveyData(survey);
    } catch (error) {
      console.error('Error loading survey data:', error);
      Alert.alert('Error', 'Failed to load survey data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewFloor = () => {
    if (!surveyData) return;
    
    navigation.navigate('NonResidentialFloorDetail', {
      surveyId: surveyData.id,
      editMode: false,
      floorId: null,
    });
  };

  const handleEditFloor = (floorId: string) => {
    if (!surveyData) return;
    
    const floorData = surveyData.data.nonResidentialPropertyAssessments?.find(
      floor => floor.id === floorId
    );
    
    navigation.navigate('NonResidentialFloorDetail', {
      surveyId: surveyData.id,
      editMode: true,
      floorId: floorId,
      floorData: floorData,
    });
  };

  const handleDeleteFloor = (floorId: string) => {
    if (!surveyData) return;
    
    Alert.alert(
      'Delete Floor',
      'Are you sure you want to delete this floor detail?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFloors = surveyData.data.nonResidentialPropertyAssessments?.filter(
                floor => floor.id !== floorId
              ) || [];
              
              const updatedSurveyData = {
                ...surveyData,
                data: {
                  ...surveyData.data,
                  nonResidentialPropertyAssessments: updatedFloors,
                },
              };
              
              await updateLocalSurvey(surveyData.id, updatedSurveyData);
              setSurveyData(updatedSurveyData);
              Alert.alert('Success', 'Floor detail deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete floor detail');
            }
          }
        }
      ]
    );
  };

  const renderFloorCard = ({ item }: { item: FloorDetail }) => (
    <View style={styles.floorCard}>
      <View style={styles.floorHeader}>
        <Text style={styles.floorTitle}>Floor {item.floorNumber}</Text>
        <View style={styles.floorActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditFloor(item.id)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteFloor(item.id)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.floorDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Establishment:</Text>
          <Text style={styles.detailValue}>{item.establishmentName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{item.propertyCategory}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sub-Category:</Text>
          <Text style={styles.detailValue}>{item.propertySubCategory}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Occupancy Status:</Text>
          <Text style={styles.detailValue}>{item.occupancyStatus}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Built-up Area:</Text>
          <Text style={styles.detailValue}>{item.builtupArea} sq ft</Text>
        </View>
        {item.licenseNo && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License No:</Text>
            <Text style={styles.detailValue}>{item.licenseNo}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading floor details...</Text>
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

  const floors = surveyData.data && surveyData.data.nonResidentialPropertyAssessments ? surveyData.data.nonResidentialPropertyAssessments : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Non-Residential Floor Details</Text>
        <Text style={styles.subtitle}>
          Survey: {surveyData.id.substring(0, 8)}...
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>
            Total Floors: {floors.length}
          </Text>
        </View>

        {floors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No non-residential floor details added yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the button below to add your first floor detail
            </Text>
          </View>
        ) : (
          <FlatList
            data={floors}
            renderItem={renderFloorCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.floorList}
          />
        )}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddNewFloor}
          >
            <Text style={styles.addButtonText}>Add New Floor Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  floorList: {
    paddingBottom: 16,
  },
  floorCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  floorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  floorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: 'white',
  },
  floorDetails: {
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
    color: '#111827',
    fontWeight: '600',
  },
  addButtonContainer: {
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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