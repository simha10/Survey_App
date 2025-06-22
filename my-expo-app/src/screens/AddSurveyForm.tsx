import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { saveSurveyLocally } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

// These would typically come from an API
const dummyMohalla = [{ label: 'Mohalla 1', value: 'mohalla1' }];
const dummyResponseTypes = [
  { label: 'Old Property', value: 'OLD_PROPERTY' },
  { label: 'New Property', value: 'NEW_PROPERTY' },
  { label: 'Door Lock', value: 'DOOR_LOCK' },
];
const dummyRespondentStatus = [
    { label: 'Owner', value: 'OWNER' },
    { label: 'Tenant', value: 'TENANT' },
];
const dummyPropertyTypes = [
    { label: 'House', value: 'HOUSE' },
    { label: 'Flat', value: 'FLAT' },
];
const dummyRoadTypes = [
    { label: 'Width < 3m', value: 'WIDTH_LESS_THAN_3M' },
    { label: 'Width 3-11m', value: 'WIDTH_3_TO_11M' },
];
const dummyConstructionTypes = [
    { label: 'Constructed', value: 'CONSTRUCTED' },
    { label: 'Not Constructed', value: 'NOT_CONSTRUCTED' },
];
const dummyWaterSources = [
    { label: 'Own', value: 'OWN' },
    { label: 'Municipal', value: 'MUNICIPAL' },
];
const dummyDisposalTypes = [
    { label: 'Sewerage', value: 'SEWERAGE' },
    { label: 'Septic Tank', value: 'SEPTIC_TANK' },
];
const yesNoOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' },
];


export default function AddSurveyForm({ route }: any) {
  const { surveyType } = route.params;
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    // Survey Details
    mohalla: '',
    parcelId: '',
    mapId: '',
    gisId: '',
    subGisId: '',
    // Property Details
    responseType: '',
    oldHouseNo: '',
    electricityConsumerName: '',
    waterSewerageConnectionNo: '',
    respondentName: '',
    respondentStatus: '',
    // Owner Details
    ownerName: '',
    fatherHusbandName: '',
    mobileNumber: '',
    aadharNumber: '',
    // Location Details
    latitude: '',
    longitude: '',
    propertyType: '',
    buildingName: '',
    roadType: '',
    constructionYear: '',
    constructionType: '',
    addressRoadName: '',
    locality: '',
    pinCode: '',
    landmark: '',
    fourWayEast: '',
    fourWayWest: '',
    fourWayNorth: '',
    fourWaySouth: '',
    // Other Details
    sourceOfWater: '',
    rainWaterHarvesting: '',
    plantationAvailable: '',
    parkingAvailable: '',
    pollutionCreated: '',
    pollutionMeasurement: '',
    waterSupplyWithin200m: false,
    sewerageLineWithin100m: false,
    disposalType: '',
    totalPlotArea: '',
    builtupAreaOfGroundFloor: '',
    remarks: '',
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await saveSurveyLocally({
        id: new Date().toISOString(),
        surveyType,
        ...formData,
      });
      Alert.alert('Success', 'Survey saved locally!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save survey.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>New {surveyType} Survey</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Survey Details</Text>
          <FormInput label="ULB" value="Pre-filled ULB" editable={false} />
          <FormInput label="Zone" value="Pre-filled Zone" editable={false} />
          <FormInput label="Ward" value="Pre-filled Ward" editable={false} />
          <FormDropdown label="Mohalla" required items={dummyMohalla} onValueChange={(value) => handleInputChange('mohalla', value)} value={formData.mohalla} />
          <FormInput label="Parcel ID" onChangeText={(value) => handleInputChange('parcelId', value)} value={formData.parcelId} keyboardType="numeric" />
          <FormInput label="Map ID" required onChangeText={(value) => handleInputChange('mapId', value)} value={formData.mapId} keyboardType="numeric" />
          <FormInput label="GIS ID" required onChangeText={(value) => handleInputChange('gisId', value)} value={formData.gisId} />
          <FormInput label="Sub-GIS ID" onChangeText={(value) => handleInputChange('subGisId', value)} value={formData.subGisId} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Property Details</Text>
          <FormDropdown label="Response Type" required items={dummyResponseTypes} onValueChange={(value) => handleInputChange('responseType', value)} value={formData.responseType} />
          <FormInput label="Old House No." required onChangeText={(value) => handleInputChange('oldHouseNo', value)} value={formData.oldHouseNo} />
          <FormInput label="Electricity Consumer Name" onChangeText={(value) => handleInputChange('electricityConsumerName', value)} value={formData.electricityConsumerName} />
          <FormInput label="Water Sewerage Connection No." onChangeText={(value) => handleInputChange('waterSewerageConnectionNo', value)} value={formData.waterSewerageConnectionNo} />
          <FormInput label="Respondent Name" required onChangeText={(value) => handleInputChange('respondentName', value)} value={formData.respondentName} />
          <FormDropdown label="Respondent Status" required items={dummyRespondentStatus} onValueChange={(value) => handleInputChange('respondentStatus', value)} value={formData.respondentStatus} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Owner Details</Text>
          <FormInput label="Owner Name" required onChangeText={(value) => handleInputChange('ownerName', value)} value={formData.ownerName} />
          <FormInput label="Father/Husband Name" required onChangeText={(value) => handleInputChange('fatherHusbandName', value)} value={formData.fatherHusbandName} />
          <FormInput label="Mobile Number" onChangeText={(value) => handleInputChange('mobileNumber', value)} value={formData.mobileNumber} keyboardType="phone-pad" />
          <FormInput label="Aadhar Number" onChangeText={(value) => handleInputChange('aadharNumber', value)} value={formData.aadharNumber} keyboardType="numeric" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Location Details</Text>
          <FormInput label="Latitude" onChangeText={(value) => handleInputChange('latitude', value)} value={formData.latitude} keyboardType="numeric" />
          <FormInput label="Longitude" onChangeText={(value) => handleInputChange('longitude', value)} value={formData.longitude} keyboardType="numeric" />
          <FormInput label="Assessment Year" value={new Date().getFullYear().toString()} editable={false} />
          <FormDropdown label="Property Type" required items={dummyPropertyTypes} onValueChange={(value) => handleInputChange('propertyType', value)} value={formData.propertyType} />
          <FormInput label="Building Name" onChangeText={(value) => handleInputChange('buildingName', value)} value={formData.buildingName} />
          <FormDropdown label="Road Type" required items={dummyRoadTypes} onValueChange={(value) => handleInputChange('roadType', value)} value={formData.roadType} />
          <FormInput label="Construction Year" required onChangeText={(value) => handleInputChange('constructionYear', value)} value={formData.constructionYear} keyboardType="numeric" />
          <FormDropdown label="Construction Type" required items={dummyConstructionTypes} onValueChange={(value) => handleInputChange('constructionType', value)} value={formData.constructionType} />
          <FormInput label="Address/Road Name" onChangeText={(value) => handleInputChange('addressRoadName', value)} value={formData.addressRoadName} />
          <FormInput label="Locality" required onChangeText={(value) => handleInputChange('locality', value)} value={formData.locality} />
          <FormInput label="PIN Code" required onChangeText={(value) => handleInputChange('pinCode', value)} value={formData.pinCode} keyboardType="numeric" />
          <FormInput label="Landmark" onChangeText={(value) => handleInputChange('landmark', value)} value={formData.landmark} />
          <FormInput label="Four Way-East/West/North/South" onChangeText={(value) => handleInputChange('fourWayEast', value)} value={formData.fourWayEast} />
          <FormInput label="New Ward" value="Pre-filled New Ward" editable={false} />
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Other Details</Text>
            <FormDropdown label="Source of Water" required items={dummyWaterSources} onValueChange={(value) => handleInputChange('sourceOfWater', value)} value={formData.sourceOfWater} />
            <FormDropdown label="Rain Water Harvesting" required items={yesNoOptions} onValueChange={(value) => handleInputChange('rainWaterHarvesting', value)} value={formData.rainWaterHarvesting} />
            
            {surveyType !== 'Residential' && (
                <>
                    <FormDropdown label="Plantation Available" required items={yesNoOptions} onValueChange={(value) => handleInputChange('plantationAvailable', value)} value={formData.plantationAvailable} />
                    <FormDropdown label="Parking Available" required items={yesNoOptions} onValueChange={(value) => handleInputChange('parkingAvailable', value)} value={formData.parkingAvailable} />
                    <FormDropdown label="Pollution Created" required items={yesNoOptions} onValueChange={(value) => handleInputChange('pollutionCreated', value)} value={formData.pollutionCreated} />
                    <FormInput label="Pollution Measurement" onChangeText={(value) => handleInputChange('pollutionMeasurement', value)} value={formData.pollutionMeasurement} />
                </>
            )}

            <FormDropdown label="Water Supply within 200m" required items={yesNoOptions} onValueChange={(value) => handleInputChange('waterSupplyWithin200m', value)} value={''+formData.waterSupplyWithin200m} />
            <FormDropdown label="Sewerage Line within 100m" required items={yesNoOptions} onValueChange={(value) => handleInputChange('sewerageLineWithin100m', value)} value={''+formData.sewerageLineWithin100m} />
            <FormDropdown label="Disposal Type" required items={dummyDisposalTypes} onValueChange={(value) => handleInputChange('disposalType', value)} value={formData.disposalType} />
            <FormInput label="Total Plot Area" required onChangeText={(value) => handleInputChange('totalPlotArea', value)} value={formData.totalPlotArea} keyboardType="numeric" />
            <FormInput label="Built-up Area of Ground Floor" required onChangeText={(value) => handleInputChange('builtupAreaOfGroundFloor', value)} value={formData.builtupAreaOfGroundFloor} keyboardType="numeric" />
            <FormInput label="Remarks" onChangeText={(value) => handleInputChange('remarks', value)} value={formData.remarks} multiline />
        </View>

        <View style={styles.buttonContainer}>
            <Button title="Save Survey" onPress={handleSave} />
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
  buttonContainer: {
    margin: 16,
  }
}); 