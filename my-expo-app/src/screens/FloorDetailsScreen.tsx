import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { submitSurvey } from '../services/surveyService';

// Dummy dropdown data (replace with API data in production)
const dummyFloors = [
  { label: 'Ground Floor', value: 1 },
  { label: '1st Floor', value: 2 },
  { label: '2nd Floor', value: 3 },
  { label: '3rd Floor', value: 4 },
  { label: '4th Floor', value: 5 },
];
const dummyOccupancy = [
  { label: 'Self Occupied', value: 'SELF_OCCUPIED' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Mix', value: 'MIX' },
];
const dummyConstructionNature = [
  { label: 'Pucckaa RCC/RB Roof', value: 'PUCCKAA_RCC_RB_ROOF' },
  { label: 'Other Pucckaa', value: 'OTHER_PUCCKAA' },
  { label: 'Kucchhaa', value: 'KUCCHHAA' },
];

export default function FloorDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mainSurveyData, surveyType } = route.params as any;
  const [floors, setFloors] = useState<any[]>([]);
  const [floorForm, setFloorForm] = useState({
    floornumberId: '',
    occupancyStatusId: '',
    constructionNatureId: '',
    coveredArea: '',
    allRoomVerandaArea: '',
    allBalconyKitchenArea: '',
    allGarageArea: '',
    carpetArea: '',
    // Add non-residential fields as needed
  });

  const handleInputChange = (name: string, value: string) => {
    setFloorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFloor = () => {
    // Basic validation
    if (!floorForm.floornumberId) {
      Alert.alert('Validation', 'Please select a floor.');
      return;
    }
    setFloors((prev) => [...prev, floorForm]);
    setFloorForm({
      floornumberId: '',
      occupancyStatusId: '',
      constructionNatureId: '',
      coveredArea: '',
      allRoomVerandaArea: '',
      allBalconyKitchenArea: '',
      allGarageArea: '',
      carpetArea: '',
    });
  };

  const handleSurveyDone = async () => {
    try {
      const payload = {
        ...mainSurveyData,
        residentialPropertyAssessments: surveyType === 'Residential' ? floors : [],
        nonResidentialPropertyAssessments: surveyType !== 'Residential' ? floors : [],
      };
      await submitSurvey(payload);
      Alert.alert('Success', 'Survey submitted successfully!', [
        {
          text: 'Add Another Survey',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'SurveyorDashboard' as never }] }),
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit survey. Please try again.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 16 }}>Add Floor Details</Text>
      <Text style={{ marginHorizontal: 16, marginBottom: 8 }}>
        Add floor details for this property. If there are no floors, tap 'Survey Done'.
      </Text>
      <View style={{ backgroundColor: 'white', margin: 16, borderRadius: 8, padding: 16 }}>
        <FormDropdown
          label="Floor"
          required
          items={dummyFloors}
          onValueChange={(value) => handleInputChange('floornumberId', value)}
          value={floorForm.floornumberId}
        />
        <FormDropdown
          label="Occupancy Status"
          required
          items={dummyOccupancy}
          onValueChange={(value) => handleInputChange('occupancyStatusId', value)}
          value={floorForm.occupancyStatusId}
        />
        <FormDropdown
          label="Construction Nature"
          required
          items={dummyConstructionNature}
          onValueChange={(value) => handleInputChange('constructionNatureId', value)}
          value={floorForm.constructionNatureId}
        />
        <FormInput
          label="Covered Area (sq ft)"
          required
          keyboardType="numeric"
          value={floorForm.coveredArea}
          onChangeText={(value) => handleInputChange('coveredArea', value)}
        />
        <FormInput
          label="All Room/Veranda Area (sq ft)"
          required
          keyboardType="numeric"
          value={floorForm.allRoomVerandaArea}
          onChangeText={(value) => handleInputChange('allRoomVerandaArea', value)}
        />
        <FormInput
          label="All Balcony/Kitchen Area (sq ft)"
          required
          keyboardType="numeric"
          value={floorForm.allBalconyKitchenArea}
          onChangeText={(value) => handleInputChange('allBalconyKitchenArea', value)}
        />
        <FormInput
          label="All Garage Area (sq ft)"
          required
          keyboardType="numeric"
          value={floorForm.allGarageArea}
          onChangeText={(value) => handleInputChange('allGarageArea', value)}
        />
        <FormInput
          label="Carpet Area (sq ft)"
          required
          keyboardType="numeric"
          value={floorForm.carpetArea}
          onChangeText={(value) => handleInputChange('carpetArea', value)}
        />
        {/* Add more fields for non-residential as needed */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <Button title="Add Floor" onPress={handleAddFloor} />
          <Button title="Survey Done" onPress={handleSurveyDone} />
        </View>
      </View>
      {floors.length > 0 && (
        <View style={{ margin: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Added Floors:</Text>
          {floors.map((floor, idx) => (
            <Text key={idx} style={{ marginBottom: 4 }}>
              Floor: {floor.floornumberId}, Occupancy: {floor.occupancyStatusId}, Area:{' '}
              {floor.coveredArea} sq ft
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
