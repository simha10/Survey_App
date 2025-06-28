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
import DateTimePicker from '@react-native-community/datetimepicker';
import { getLocalSurvey, updateLocalSurvey } from '../utils/storage';
import { fetchMasterData } from '../services/surveyService';

interface FloorDetail {
  id: string;
  floorNumberId: number;
  nrPropertyCategoryId: number;
  nrSubCategoryId: number;
  establishmentName: string;
  licenseNo: string;
  licenseExpiryDate: string;
  occupancyStatusId: number;
  constructionNatureId: number;
  builtupArea: string;
}

interface MasterData {
  floorNumbers: Array<{ floorNumberId: number; floorNumberName: string }>;
  occupancyStatuses: Array<{ occupancyStatusId: number; occupancyStatusName: string }>;
  constructionNatures: Array<{ constructionNatureId: number; constructionNatureName: string }>;
  nrPropertyCategories: Array<{ propertyCategoryId: number; propertyCategoryName: string }>;
  nrPropertySubCategories: Array<{ subCategoryId: number; subCategoryName: string; propertyCategoryId: number }>;
}

type Navigation = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export default function NonResidentialFloorDetail() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [masterData, setMasterData] = useState<MasterData>({
    floorNumbers: [],
    occupancyStatuses: [],
    constructionNatures: [],
    nrPropertyCategories: [],
    nrPropertySubCategories: [],
  });

  // Form state
  const [formData, setFormData] = useState<FloorDetail>({
    id: '',
    floorNumberId: 0,
    nrPropertyCategoryId: 0,
    nrSubCategoryId: 0,
    establishmentName: '',
    licenseNo: '',
    licenseExpiryDate: '',
    occupancyStatusId: 0,
    constructionNatureId: 0,
    builtupArea: '',
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
        nrPropertyCategories: data.nrPropertyCategories || [],
        nrPropertySubCategories: data.nrPropertySubCategories || [],
      });
    } catch (error) {
      console.error('Error loading master data:', error);
      Alert.alert('Error', 'Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FloorDetail, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle number fields
      if (field === 'floorNumberId' || field === 'nrPropertyCategoryId' || 
          field === 'nrSubCategoryId' || field === 'occupancyStatusId' || 
          field === 'constructionNatureId') {
        newData[field] = parseInt(value) || 0;
      } else {
        newData[field] = value;
      }
      
      return newData;
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        licenseExpiryDate: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const getFilteredSubCategories = () => {
    if (!formData.nrPropertyCategoryId) return [];
    return masterData.nrPropertySubCategories.filter(
      sub => sub.propertyCategoryId === formData.nrPropertyCategoryId
    );
  };

  const validateForm = (): boolean => {
    if (!formData.floorNumberId) {
      Alert.alert('Validation Error', 'Please select Floor Number');
      return false;
    }
    if (!formData.nrPropertyCategoryId) {
      Alert.alert('Validation Error', 'Please select Property Category');
      return false;
    }
    if (!formData.nrSubCategoryId) {
      Alert.alert('Validation Error', 'Please select Property Sub Category');
      return false;
    }
    if (!formData.establishmentName.trim()) {
      Alert.alert('Validation Error', 'Please enter Establishment Name');
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
    if (!formData.builtupArea || parseFloat(formData.builtupArea) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid Built-up Area');
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
      const existingFloors = survey.data && survey.data.nonResidentialPropertyAssessments ? survey.data.nonResidentialPropertyAssessments : [];
      let updatedFloors;

      if (editMode) {
        // Update existing floor
        updatedFloors = existingFloors.map(floor =>
          floor.id === floorId ? formData : floor
        );
      } else {
        // Add new floor
        updatedFloors = [...existingFloors, formData];
      }

      const updatedSurvey = {
        ...survey,
        data: {
          ...survey.data,
          nonResidentialPropertyAssessments: updatedFloors,
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
            {editMode ? 'Edit' : 'Add'} Non-Residential Floor Detail
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

          {/* Property Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Property Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.nrPropertyCategoryId}
                onValueChange={(value) => {
                  handleInputChange('nrPropertyCategoryId', value.toString());
                  // Reset sub category when category changes
                  handleInputChange('nrSubCategoryId', '0');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Property Category" value={0} />
                {masterData.nrPropertyCategories.map((category) => (
                  <Picker.Item
                    key={category.propertyCategoryId}
                    label={category.propertyCategoryName}
                    value={category.propertyCategoryId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Property Sub Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Property Sub Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.nrSubCategoryId}
                onValueChange={(value) => handleInputChange('nrSubCategoryId', value.toString())}
                style={styles.picker}
                enabled={!!formData.nrPropertyCategoryId}
              >
                <Picker.Item label="Select Property Sub Category" value={0} />
                {getFilteredSubCategories().map((subCategory) => (
                  <Picker.Item
                    key={subCategory.subCategoryId}
                    label={subCategory.subCategoryName}
                    value={subCategory.subCategoryId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Establishment Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Establishment Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.establishmentName}
              onChangeText={(value) => handleInputChange('establishmentName', value)}
              placeholder="Enter establishment name"
            />
          </View>

          {/* License Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              value={formData.licenseNo}
              onChangeText={(value) => handleInputChange('licenseNo', value)}
              placeholder="Enter license number"
            />
          </View>

          {/* License Expiry Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>License Expiry Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={formData.licenseExpiryDate ? styles.dateText : styles.placeholderText}>
                {formData.licenseExpiryDate || 'Select expiry date'}
              </Text>
            </TouchableOpacity>
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

          {/* Built-up Area */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Built-up Area (sq ft) *</Text>
            <TextInput
              style={styles.input}
              value={formData.builtupArea}
              onChangeText={(value) => handleInputChange('builtupArea', value)}
              placeholder="Enter built-up area"
              keyboardType="numeric"
            />
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

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
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
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
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