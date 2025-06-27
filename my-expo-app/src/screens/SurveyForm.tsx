import { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Alert, findNodeHandle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { saveSurveyLocally } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SurveyForm({ route }: any) {
  let { surveyType } = route.params as { surveyType: string };
  if (surveyType === 'Mix') surveyType = 'Mixed';
  type SurveyTypeKey = 'Residential' | 'Non-Residential' | 'Mixed';
  const surveyTypeKey = surveyType as SurveyTypeKey;
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldRefs = useRef<{ [key: string]: View | null }>({});

  // Dummy master data arrays with UUIDs
  const ulbOptions = [
    { label: 'Lucknow', value: '00000000-0000-0000-0000-000000000001' },
  ];
  const zoneOptions = [
    { label: 'Zone 1', value: '00000000-0000-0000-0000-000000000002' },
  ];
  const wardOptions = [
    { label: 'Ward No. 1', value: '00000000-0000-0000-0000-000000000003' },
  ];
  const mohallaOptions = [
    { label: 'Jankipuram', value: '00000000-0000-0000-0000-000000000004' },
    { label: 'Aliganj', value: '00000000-0000-0000-0000-000000000005' },
    { label: 'Gomti Nagar', value: '00000000-0000-0000-0000-000000000006' },
  ];
  const responseTypeOptions = [
    { label: 'Old Property', value: '10000000-0000-0000-0000-000000000001' },
    { label: 'New Property', value: '10000000-0000-0000-0000-000000000002' },
    { label: 'Door Lock', value: '10000000-0000-0000-0000-000000000003' },
    { label: 'Access Denied', value: '10000000-0000-0000-0000-000000000004' },
  ];
  const respondentStatusOptions = [
    { label: 'Owner', value: '20000000-0000-0000-0000-000000000001' },
    { label: 'Occupier', value: '20000000-0000-0000-0000-000000000002' },
    { label: 'Tenant', value: '20000000-0000-0000-0000-000000000003' },
    { label: 'Employee', value: '20000000-0000-0000-0000-000000000004' },
    { label: 'Other', value: '20000000-0000-0000-0000-000000000005' },
  ];
  const propertyTypeOptions = [
    { label: 'House', value: '30000000-0000-0000-0000-000000000001' },
    { label: 'Flat', value: '30000000-0000-0000-0000-000000000002' },
    { label: 'Plot/Land', value: '30000000-0000-0000-0000-000000000003' },
  ];
  const roadTypeOptions = [
    { label: 'Width < 3m', value: '40000000-0000-0000-0000-000000000001' },
    { label: 'Width 3-11m', value: '40000000-0000-0000-0000-000000000002' },
    { label: 'Width 12-24m', value: '40000000-0000-0000-0000-000000000003' },
    { label: 'Width > 24m', value: '40000000-0000-0000-0000-000000000004' },
  ];
  const constructionTypeOptions = [
    { label: 'Constructed', value: '50000000-0000-0000-0000-000000000001' },
    { label: 'Not Constructed', value: '50000000-0000-0000-0000-000000000002' },
    { label: 'Under Construction', value: '50000000-0000-0000-0000-000000000003' },
  ];
  const waterSourceOptions = [
    { label: 'Own', value: '60000000-0000-0000-0000-000000000001' },
    { label: 'Municipal', value: '60000000-0000-0000-0000-000000000002' },
    { label: 'Public Tap < 100 Yards', value: '60000000-0000-0000-0000-000000000003' },
    { label: 'Public Tap > 100 Yards', value: '60000000-0000-0000-0000-000000000004' },
  ];
  const disposalTypeOptions = [
    { label: 'Sewerage', value: '70000000-0000-0000-0000-000000000001' },
    { label: 'Septic Tank', value: '70000000-0000-0000-0000-000000000002' },
  ];

  // Dummy UUIDs for SurveyTypeMaster (replace with real UUIDs from your DB/seed)
  const SURVEY_TYPE_UUIDS = {
    Residential: '11111111-1111-1111-1111-111111111111',
    'Non-Residential': '22222222-2222-2222-2222-222222222222',
    Mixed: '33333333-3333-3333-3333-333333333333',
  };

  // State aligned with backend DTO
  const [formData, setFormData] = useState({
    ulbId: ulbOptions[0].value,
    zoneId: zoneOptions[0].value,
    wardId: wardOptions[0].value,
    mohallaId: mohallaOptions[0].value,
    parcelId: '',
    mapId: '',
    gisId: '',
    subGisId: '',
    responseTypeId: '',
    oldHouseNumber: '',
    electricityConsumerName: '',
    waterSewerageConnectionNumber: '',
    respondentName: '',
    respondentStatusId: '',
    ownerName: '',
    fatherHusbandName: '',
    mobileNumber: '',
    aadharNumber: '',
    propertyLatitude: '',
    propertyLongitude: '',
    assessmentYear: '',
    propertyTypeId: '',
    buildingName: '',
    roadTypeId: '',
    constructionYear: '',
    constructionTypeId: '',
    addressRoadName: '',
    locality: '',
    pinCode: '',
    landmark: '',
    fourWayEast: '',
    fourWayWest: '',
    fourWayNorth: '',
    fourWaySouth: '',
    newWard: '',
    waterSourceId: '',
    rainWaterHarvestingSystem: '',
    plantation: '',
    parking: '',
    pollution: '',
    pollutionMeasurementTaken: '',
    waterSupplyWithin200Meters: '',
    sewerageLineWithin100Meters: '',
    disposalTypeId: '',
    totalPlotArea: '',
    builtupAreaOfGroundFloor: '',
    remarks: '',
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields: { key: keyof typeof formData; label: string }[] = [
      { key: 'mohallaId', label: 'Mohalla' },
      { key: 'mapId', label: 'Map ID' },
      { key: 'gisId', label: 'GIS ID' },
      { key: 'responseTypeId', label: 'Response Type' },
      { key: 'oldHouseNumber', label: 'Old House No.' },
      { key: 'respondentName', label: 'Respondent Name' },
      { key: 'respondentStatusId', label: 'Respondent Status' },
      { key: 'ownerName', label: 'Owner Name' },
      { key: 'fatherHusbandName', label: 'Father/Husband Name' },
      { key: 'propertyTypeId', label: 'Property Type' },
      { key: 'roadTypeId', label: 'Road Type' },
      { key: 'constructionYear', label: 'Construction Year' },
      { key: 'constructionTypeId', label: 'Construction Type' },
      { key: 'locality', label: 'Locality' },
      { key: 'pinCode', label: 'PIN Code' },
      { key: 'waterSourceId', label: 'Source of Water' },
      { key: 'rainWaterHarvestingSystem', label: 'Rain Water Harvesting' },
      { key: 'waterSupplyWithin200Meters', label: 'Water Supply within 200m' },
      { key: 'sewerageLineWithin100Meters', label: 'Sewerage Line within 100m' },
      { key: 'disposalTypeId', label: 'Disposal Type' },
      { key: 'totalPlotArea', label: 'Total Plot Area' },
      { key: 'builtupAreaOfGroundFloor', label: 'Built-up Area of Ground Floor' },
    ];

    if (surveyTypeKey !== 'Residential') {
      requiredFields.push(
        { key: 'plantation', label: 'Plantation Available' },
        { key: 'parking', label: 'Parking Available' },
        { key: 'pollution', label: 'Pollution Created' }
      );
    }

    const firstMissingField = requiredFields.find(field => !formData[field.key]);

    if (firstMissingField) {
      const fieldRef = fieldRefs.current[firstMissingField.key];
      
      if (fieldRef && scrollViewRef.current) {
        const reactNodeHandle = findNodeHandle(scrollViewRef.current);
        if (reactNodeHandle) {
          fieldRef.measureLayout(
            reactNodeHandle,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y, animated: true });
            },
            () => {} // onError
          );
        }
      }

      Alert.alert(
        'Missing Information',
        `Please fill out the "${firstMissingField.label}" field.`
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      // Get surveyor userId from AsyncStorage
      const userJson = await AsyncStorage.getItem('user');
      let uploadedById = '';
      if (userJson) {
        const user = JSON.parse(userJson);
        uploadedById = user.userId || user.id || '';
      } else {
        uploadedById = await AsyncStorage.getItem('userId') || '';
      }
      if (!uploadedById) {
        Alert.alert('Error', 'Surveyor user ID not found. Please log in again.');
        return;
      }
      // Build DTO as per backend schema
      const surveyData = {
        surveyDetails: {
          ulbId: formData.ulbId,
          zoneId: formData.zoneId,
          wardId: formData.wardId,
          mohallaId: formData.mohallaId,
          surveyTypeId: SURVEY_TYPE_UUIDS[surveyTypeKey],
          entryDate: new Date().toISOString(),
          parcelId: formData.parcelId ? Number(formData.parcelId) : undefined,
          mapId: Number(formData.mapId),
          gisId: formData.gisId,
          subGisId: formData.subGisId,
        },
        propertyDetails: {
          responseTypeId: formData.responseTypeId,
          oldHouseNumber: formData.oldHouseNumber,
          electricityConsumerName: formData.electricityConsumerName,
          waterSewerageConnectionNumber: formData.waterSewerageConnectionNumber,
          respondentName: formData.respondentName,
          respondentStatusId: formData.respondentStatusId,
        },
        ownerDetails: {
          ownerName: formData.ownerName,
          fatherHusbandName: formData.fatherHusbandName,
          mobileNumber: formData.mobileNumber,
          aadharNumber: formData.aadharNumber,
        },
        locationDetails: {
          propertyLatitude: Number(formData.propertyLatitude),
          propertyLongitude: Number(formData.propertyLongitude),
          assessmentYear: formData.assessmentYear,
          propertyTypeId: formData.propertyTypeId,
          buildingName: formData.buildingName,
          roadTypeId: formData.roadTypeId,
          constructionYear: formData.constructionYear,
          constructionTypeId: formData.constructionTypeId,
          addressRoadName: formData.addressRoadName,
          locality: formData.locality,
          pinCode: Number(formData.pinCode),
          landmark: formData.landmark,
          fourWayEast: formData.fourWayEast,
          fourWayWest: formData.fourWayWest,
          fourWayNorth: formData.fourWayNorth,
          fourWaySouth: formData.fourWaySouth,
          newWard: formData.newWard,
        },
        otherDetails: {
          waterSourceId: formData.waterSourceId,
          rainWaterHarvestingSystem: formData.rainWaterHarvestingSystem,
          plantation: formData.plantation,
          parking: formData.parking,
          pollution: formData.pollution,
          pollutionMeasurementTaken: formData.pollutionMeasurementTaken,
          waterSupplyWithin200Meters: formData.waterSupplyWithin200Meters,
          sewerageLineWithin100Meters: formData.sewerageLineWithin100Meters,
          disposalTypeId: formData.disposalTypeId,
          totalPlotArea: Number(formData.totalPlotArea),
          builtupAreaOfGroundFloor: Number(formData.builtupAreaOfGroundFloor),
          remarks: formData.remarks,
        },
        residentialPropertyAssessments: [],
        nonResidentialPropertyAssessments: [],
      };

      // Create survey object for local storage
      const surveyToSave = {
        id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        surveyType: surveyTypeKey,
        data: surveyData,
        createdAt: new Date().toISOString(),
        synced: false,
      };

      // Save to local storage
      await saveSurveyLocally(surveyToSave);

      // Navigate to survey intermediate screen
      (navigation as any).navigate('SurveyIntermediate', {
        surveyId: surveyToSave.id,
        surveyType: surveyTypeKey,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save survey data.');
    }
  };

  // For yes/no dropdowns, use:
  const yesNoOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <Text style={styles.title}>New {surveyType} Survey</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Survey Details</Text>
          <FormInput label="ULB" value="Lucknow" editable={false} />
          <FormInput label="Zone" value="Zone 1" editable={false} />
          <FormInput label="Ward" value="Ward No. 1" editable={false} />
          <FormDropdown
            ref={el => { fieldRefs.current['mohallaId'] = el; }}
            label="Mohalla"
            required
            items={mohallaOptions}
            onValueChange={(value: string) => handleInputChange('mohallaId', value)}
            value={formData.mohallaId}
          />
          <FormInput
            label="Parcel ID"
            onChangeText={(value: string) => handleInputChange('parcelId', value)}
            value={formData.parcelId}
            keyboardType="numeric"
          />
          <FormInput
            ref={el => { fieldRefs.current['mapId'] = el; }}
            label="Map ID"
            required
            onChangeText={(value: string) => handleInputChange('mapId', value)}
            value={formData.mapId}
            keyboardType="numeric"
          />
          <FormInput
            ref={el => { fieldRefs.current['gisId'] = el; }}
            label="GIS ID"
            required
            onChangeText={(value: string) => handleInputChange('gisId', value)}
            value={formData.gisId}
          />
          <FormInput
            label="Sub-GIS ID"
            onChangeText={(value: string) => handleInputChange('subGisId', value)}
            value={formData.subGisId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Property Details</Text>
          <FormDropdown
            ref={el => { fieldRefs.current['responseTypeId'] = el; }}
            label="Response Type"
            required
            items={responseTypeOptions}
            onValueChange={(value: string) => handleInputChange('responseTypeId', value)}
            value={formData.responseTypeId}
          />
          <FormInput
            ref={el => { fieldRefs.current['oldHouseNumber'] = el; }}
            label="Old House No."
            required
            onChangeText={(value: string) => handleInputChange('oldHouseNumber', value)}
            value={formData.oldHouseNumber}
          />
          <FormInput
            label="Electricity Consumer Name"
            onChangeText={(value: string) => handleInputChange('electricityConsumerName', value)}
            value={formData.electricityConsumerName}
          />
          <FormInput
            label="Water Sewerage Connection No."
            onChangeText={(value: string) => handleInputChange('waterSewerageConnectionNumber', value)}
            value={formData.waterSewerageConnectionNumber}
          />
          <FormInput
            ref={el => { fieldRefs.current['respondentName'] = el; }}
            label="Respondent Name"
            required
            onChangeText={(value: string) => handleInputChange('respondentName', value)}
            value={formData.respondentName}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['respondentStatusId'] = el; }}
            label="Respondent Status"
            required
            items={respondentStatusOptions}
            onValueChange={(value: string) => handleInputChange('respondentStatusId', value)}
            value={formData.respondentStatusId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Owner Details</Text>
          <FormInput
            ref={el => { fieldRefs.current['ownerName'] = el; }}
            label="Owner Name"
            required
            onChangeText={(value: string) => handleInputChange('ownerName', value)}
            value={formData.ownerName}
          />
          <FormInput
            ref={el => { fieldRefs.current['fatherHusbandName'] = el; }}
            label="Father/Husband Name"
            required
            onChangeText={(value: string) => handleInputChange('fatherHusbandName', value)}
            value={formData.fatherHusbandName}
          />
          <FormInput
            label="Mobile Number"
            onChangeText={(value: string) => handleInputChange('mobileNumber', value)}
            value={formData.mobileNumber}
            keyboardType="phone-pad"
          />
          <FormInput
            label="Aadhar Number"
            onChangeText={(value: string) => handleInputChange('aadharNumber', value)}
            value={formData.aadharNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Location Details</Text>
          <FormInput
            label="Latitude"
            onChangeText={(value: string) => handleInputChange('propertyLatitude', value)}
            value={formData.propertyLatitude}
            keyboardType="numeric"
          />
          <FormInput
            label="Longitude"
            onChangeText={(value: string) => handleInputChange('propertyLongitude', value)}
            value={formData.propertyLongitude}
            keyboardType="numeric"
          />
          <FormInput
            label="Assessment Year"
            value={new Date().getFullYear().toString()}
            editable={false}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['propertyTypeId'] = el; }}
            label="Property Type"
            required
            items={propertyTypeOptions}
            onValueChange={(value: string) => handleInputChange('propertyTypeId', value)}
            value={formData.propertyTypeId}
          />
          <FormInput
            label="Building Name"
            onChangeText={(value: string) => handleInputChange('buildingName', value)}
            value={formData.buildingName}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['roadTypeId'] = el; }}
            label="Road Type"
            required
            items={roadTypeOptions}
            onValueChange={(value: string) => handleInputChange('roadTypeId', value)}
            value={formData.roadTypeId}
          />
          <FormInput
            ref={el => { fieldRefs.current['constructionYear'] = el; }}
            label="Construction Year"
            required
            onChangeText={(value: string) => handleInputChange('constructionYear', value)}
            value={formData.constructionYear}
            keyboardType="numeric"
          />
          <FormDropdown
            ref={el => { fieldRefs.current['constructionTypeId'] = el; }}
            label="Construction Type"
            required
            items={constructionTypeOptions}
            onValueChange={(value: string) => handleInputChange('constructionTypeId', value)}
            value={formData.constructionTypeId}
          />
          <FormInput
            label="Address/Road Name"
            onChangeText={(value: string) => handleInputChange('addressRoadName', value)}
            value={formData.addressRoadName}
          />
          <FormInput
            ref={el => { fieldRefs.current['locality'] = el; }}
            label="Locality"
            required
            onChangeText={(value: string) => handleInputChange('locality', value)}
            value={formData.locality}
          />
          <FormInput
            ref={el => { fieldRefs.current['pinCode'] = el; }}
            label="PIN Code"
            required
            onChangeText={(value: string) => handleInputChange('pinCode', value)}
            value={formData.pinCode}
            keyboardType="numeric"
          />
          <FormInput
            label="Landmark"
            onChangeText={(value: string) => handleInputChange('landmark', value)}
            value={formData.landmark}
          />
          <FormInput
            label="Four Way-East/West/North/South"
            onChangeText={(value: string) => handleInputChange('fourWayEast', value)}
            value={formData.fourWayEast}
          />
          <FormInput label="New Ward" value="Pre-filled New Ward" editable={false} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Other Details</Text>
          <FormDropdown
            ref={el => { fieldRefs.current['waterSourceId'] = el; }}
            label="Source of Water"
            required
            items={waterSourceOptions}
            onValueChange={(value: string) => handleInputChange('waterSourceId', value)}
            value={formData.waterSourceId}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['rainWaterHarvestingSystem'] = el; }}
            label="Rain Water Harvesting"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('rainWaterHarvestingSystem', value)}
            value={formData.rainWaterHarvestingSystem}
          />

          {surveyType !== 'Residential' && (
            <>
              <FormDropdown
                ref={el => { fieldRefs.current['plantation'] = el; }}
                label="Plantation Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string) => handleInputChange('plantation', value)}
                value={formData.plantation}
              />
              <FormDropdown
                ref={el => { fieldRefs.current['parking'] = el; }}
                label="Parking Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string) => handleInputChange('parking', value)}
                value={formData.parking}
              />
              <FormDropdown
                ref={el => { fieldRefs.current['pollution'] = el; }}
                label="Pollution Created"
                required
                items={yesNoOptions}
                onValueChange={(value: string) => handleInputChange('pollution', value)}
                value={formData.pollution}
              />
              <FormInput
                label="Pollution Measurement"
                onChangeText={(value: string) => handleInputChange('pollutionMeasurementTaken', value)}
                value={formData.pollutionMeasurementTaken}
              />
            </>
          )}

          <FormDropdown
            ref={el => { fieldRefs.current['waterSupplyWithin200Meters'] = el; }}
            label="Water Supply within 200m"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('waterSupplyWithin200Meters', value)}
            value={formData.waterSupplyWithin200Meters}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['sewerageLineWithin100Meters'] = el; }}
            label="Sewerage Line within 100m"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('sewerageLineWithin100Meters', value)}
            value={formData.sewerageLineWithin100Meters}
          />
          <FormDropdown
            ref={el => { fieldRefs.current['disposalTypeId'] = el; }}
            label="Disposal Type"
            required
            items={disposalTypeOptions}
            onValueChange={(value: string) => handleInputChange('disposalTypeId', value)}
            value={formData.disposalTypeId}
          />
          <FormInput
            ref={el => { fieldRefs.current['totalPlotArea'] = el; }}
            label="Total Plot Area"
            required
            onChangeText={(value: string) => handleInputChange('totalPlotArea', value)}
            value={formData.totalPlotArea}
            keyboardType="numeric"
          />
          <FormInput
            ref={el => { fieldRefs.current['builtupAreaOfGroundFloor'] = el; }}
            label="Built-up Area of Ground Floor"
            required
            onChangeText={(value: string) => handleInputChange('builtupAreaOfGroundFloor', value)}
            value={formData.builtupAreaOfGroundFloor}
            keyboardType="numeric"
          />
          <FormInput
            label="Remarks"
            onChangeText={(value: string) => handleInputChange('remarks', value)}
            value={formData.remarks}
            multiline
          />
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
  },
});
