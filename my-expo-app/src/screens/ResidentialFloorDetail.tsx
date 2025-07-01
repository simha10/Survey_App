import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getLocalSurvey, updateLocalSurvey } from '../utils/storage';
import { fetchMasterData } from '../services/surveyService';

interface FloorDetail {
  id: string;
  floorNumberId: number;
  occupancyStatusId: number;
  constructionNatureId: number;
  coveredArea: string;
  allRoomVerandaArea: string;
  allBalconyKitchenArea: string;
  allGarageArea: string;
  carpetArea: string;
}

interface MasterData {
  floorNumbers: Array<{ floorNumberId: number; floorNumberName: string }>;
  occupancyStatuses: Array<{ occupancyStatusId: number; occupancyStatusName: string }>;
  constructionNatures: Array<{ constructionNatureId: number; constructionNatureName: string }>;
}

type Navigation = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export default function ResidentialFloorDetail() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterData, setMasterData] = useState<MasterData>({
    floorNumbers: [],
    occupancyStatuses: [],
    constructionNatures: [],
  });

  // Form state
  const [formData, setFormData] = useState<FloorDetail>({
    id: '',
    floorNumberId: 0,
    occupancyStatusId: 0,
    constructionNatureId: 0,
    coveredArea: '',
    allRoomVerandaArea: '',
    allBalconyKitchenArea: '',
    allGarageArea: '',
    carpetArea: '',
  });

  const surveyId = (route.params as any)?.surveyId;
  const editMode = (route.params as any)?.editMode || false;
  const floorId = (route.params as any)?.floorId;
  const floorData = (route.params as any)?.floorData;

  useEffect(() => {
    loadMasterData();
    if (editMode && floorData) {
      setFormData(floorData);
    } else {
      // Generate new ID for new floor
      setFormData(prev => ({
        ...prev,
        id: `floor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }));
    }
  }, []);

  const loadMasterData = async () => {
    try {
      const data = await fetchMasterData();
      setMasterData({
        floorNumbers: data.floorNumbers || [],
        occupancyStatuses: data.occupancyStatuses || [],
        constructionNatures: data.constructionNatures || [],
      });
    } catch (error) {
      console.error('Error loading master data:', error);
      Alert.alert('Error', 'Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const calculateCarpetArea = () => {
    const coveredArea = parseFloat(formData.coveredArea) || 0;
    // Carpet area is 80% of covered area
    const carpet = coveredArea * 0.8;
    return Number.isInteger(carpet) ? String(carpet) : carpet.toFixed(2);
  };

  const handleInputChange = (field: keyof FloorDetail, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle number fields
      if (field === 'floorNumberId' || field === 'occupancyStatusId' || 
          field === 'constructionNatureId') {
        newData[field] = parseInt(value) || 0;
      } else {
        newData[field] = value;
      }
      
      // Auto-calculate carpet area when covered area changes
      if (field === 'coveredArea') {
        newData.carpetArea = calculateCarpetArea();
      }
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.floorNumberId) {
      Alert.alert('Validation Error', 'Please select Floor Number');
      return false;
    }
    if (!formData.occupancyStatusId) {
      Alert.alert('Validation Error', 'Please select Occupancy Status');
      return false;
    }
    if (!formData.constructionNatureId) {
      Alert.alert('Validation Error', 'Please select Construction Nature');
      return false;
    }
    if (!formData.coveredArea || parseFloat(formData.coveredArea) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid Covered Area');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const survey = await getLocalSurvey(surveyId);
      if (!survey || Array.isArray(survey)) {
        Alert.alert('Error', 'Survey not found');
        return;
      }

      const processedFormData = {
        ...formData,
        coveredArea: parseFloat(formData.coveredArea) || 0,
        allRoomVerandaArea: parseFloat(formData.allRoomVerandaArea) || 0,
        allBalconyKitchenArea: parseFloat(formData.allBalconyKitchenArea) || 0,
        allGarageArea: parseFloat(formData.allGarageArea) || 0,
        carpetArea: parseFloat(formData.carpetArea) || 0,
      };

      const existingFloors = survey.data && survey.data.residentialPropertyAssessments ? survey.data.residentialPropertyAssessments : [];
      let updatedFloors;

      if (editMode) {
        // Update existing floor
        updatedFloors = existingFloors.map(floor =>
          floor.id === floorId ? processedFormData : floor
        );
      } else {
        // Add new floor
        updatedFloors = [...existingFloors, processedFormData];
      }

      const updatedSurvey = {
        ...survey,
        data: {
          ...survey.data,
          residentialPropertyAssessments: updatedFloors,
        },
      };

      await updateLocalSurvey(surveyId, updatedSurvey);
      
      Alert.alert(
        'Success',
        editMode ? 'Floor detail updated successfully' : 'Floor detail added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving floor detail:', error);
      Alert.alert('Error', 'Failed to save floor detail');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading form data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {editMode ? 'Edit' : 'Add'} Residential Floor Detail
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Floor Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Floor Number *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.floorNumberId}
                onValueChange={(value) => handleInputChange('floorNumberId', value.toString())}
                style={styles.picker}
              >
                <Picker.Item label="Select Floor Number" value={0} />
                {masterData.floorNumbers.map((floor) => (
                  <Picker.Item
                    key={floor.floorNumberId}
                    label={floor.floorNumberName}
                    value={floor.floorNumberId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Occupancy Status */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Occupancy Status *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.occupancyStatusId}
                onValueChange={(value) => handleInputChange('occupancyStatusId', value.toString())}
                style={styles.picker}
              >
                <Picker.Item label="Select Occupancy Status" value={0} />
                {masterData.occupancyStatuses.map((status) => (
                  <Picker.Item
                    key={status.occupancyStatusId}
                    label={status.occupancyStatusName}
                    value={status.occupancyStatusId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Construction Nature */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Construction Nature *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.constructionNatureId}
                onValueChange={(value) => handleInputChange('constructionNatureId', value.toString())}
                style={styles.picker}
              >
                <Picker.Item label="Select Construction Nature" value={0} />
                {masterData.constructionNatures.map((nature) => (
                  <Picker.Item
                    key={nature.constructionNatureId}
                    label={nature.constructionNatureName}
                    value={nature.constructionNatureId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Covered Area */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Covered Area (sq ft) *</Text>
            <TextInput
              style={styles.input}
              value={formData.coveredArea}
              onChangeText={(value) => handleInputChange('coveredArea', value)}
              placeholder="Enter covered area"
              keyboardType="numeric"
            />
          </View>

          {/* Total Rooms/Veranda Area */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Rooms/Veranda Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              value={formData.allRoomVerandaArea}
              onChangeText={(value) => handleInputChange('allRoomVerandaArea', value)}
              placeholder="Enter total rooms/veranda area"
              keyboardType="numeric"
            />
          </View>

          {/* Total Balcony/Kitchen Area */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Balcony/Kitchen Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              value={formData.allBalconyKitchenArea}
              onChangeText={(value) => handleInputChange('allBalconyKitchenArea', value)}
              placeholder="Enter total balcony/kitchen area"
              keyboardType="numeric"
            />
          </View>

          {/* All Garage Area */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>All Garage Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              value={formData.allGarageArea}
              onChangeText={(value) => handleInputChange('allGarageArea', value)}
              placeholder="Enter all garage area"
              keyboardType="numeric"
            />
          </View>

          {/* Carpet Area (Auto-calculated) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Carpet Area (sq ft) *</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.carpetArea}
              editable={false}
              placeholder="Auto-calculated (80% of covered area)"
            />
            <Text style={styles.helperText}>
              Automatically calculated as 80% of covered area
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : (editMode ? 'Update' : 'Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
}); 