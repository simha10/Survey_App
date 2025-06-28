import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Alert, findNodeHandle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { saveSurveyLocally } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllMasterData } from '../services/masterDataService';

export default function SurveyForm({ route }: any) {
  let { surveyType } = route.params as { surveyType: string };
  if (surveyType === 'Mix') surveyType = 'Mixed';
  type SurveyTypeKey = 'Residential' | 'Non-Residential' | 'Mixed';
  const surveyTypeKey = surveyType as SurveyTypeKey;
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldRefs = useRef<{ [key: string]: View | null }>({});

  // State for master data
  const [masterData, setMasterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dummy master data arrays for ULB, Zone, Ward, and Mohalla (as requested)
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

  // Fetch master data on component mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMasterData();
        setMasterData(data);
      } catch (error) {
        console.error('Error loading master data:', error);
        Alert.alert('Error', 'Failed to load master data. Using fallback data.');
        // Set fallback data
        setMasterData({
          responseTypes: [
            { responseTypeId: 1, responseTypeName: 'OLD PROPERTY' },
            { responseTypeId: 2, responseTypeName: 'NEW PROPERTY' },
            { responseTypeId: 3, responseTypeName: 'DOOR LOCK' },
            { responseTypeId: 4, responseTypeName: 'ACCESS DENIED' },
          ],
          propertyTypes: [
            { propertyTypeId: 1, propertyTypeName: 'HOUSE' },
            { propertyTypeId: 2, propertyTypeName: 'FLAT' },
            { propertyTypeId: 3, propertyTypeName: 'PLOT LAND' },
          ],
          respondentStatuses: [
            { respondentStatusId: 1, respondentStatusName: 'OWNER' },
            { respondentStatusId: 2, respondentStatusName: 'OCCUPIER' },
            { respondentStatusId: 3, respondentStatusName: 'TENANT' },
            { respondentStatusId: 4, respondentStatusName: 'EMPLOYEE' },
            { respondentStatusId: 5, respondentStatusName: 'OTHER' },
          ],
          roadTypes: [
            { roadTypeId: 1, roadTypeName: 'WIDTH LESS THAN 3M' },
            { roadTypeId: 2, roadTypeName: 'WIDTH 3 TO 11M' },
            { roadTypeId: 3, roadTypeName: 'WIDTH 12 TO 24M' },
            { roadTypeId: 4, roadTypeName: 'WIDTH MORE THAN 24M' },
          ],
          constructionTypes: [
            { constructionTypeId: 1, constructionTypeName: 'CONSTRUCTED' },
            { constructionTypeId: 2, constructionTypeName: 'NOT CONSTRUCTED' },
            { constructionTypeId: 3, constructionTypeName: 'UNDER CONSTRUCTION' },
          ],
          waterSources: [
            { waterSourceId: 1, waterSourceName: 'OWN' },
            { waterSourceId: 2, waterSourceName: 'MUNICIPAL' },
            { waterSourceId: 3, waterSourceName: 'PUBLIC TAP WITHIN 100 YARDS' },
            { waterSourceId: 4, waterSourceName: 'PUBLIC TAP MORE THAN 100 YARDS' },
          ],
          disposalTypes: [
            { disposalTypeId: 1, disposalTypeName: 'SEWERAGE' },
            { disposalTypeId: 2, disposalTypeName: 'SEPTIC TANK' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadMasterData();
  }, []);

  // Transform master data to dropdown options format
  const responseTypeOptions = masterData?.responseTypes?.map((item: any) => ({
    label: item.responseTypeName,
    value: item.responseTypeId,
  })) || [];

  const respondentStatusOptions = masterData?.respondentStatuses?.map((item: any) => ({
    label: item.respondentStatusName,
    value: item.respondentStatusId,
  })) || [];

  const propertyTypeOptions = masterData?.propertyTypes?.map((item: any) => ({
    label: item.propertyTypeName,
    value: item.propertyTypeId,
  })) || [];

  const roadTypeOptions = masterData?.roadTypes?.map((item: any) => ({
    label: item.roadTypeName,
    value: item.roadTypeId,
  })) || [];

  const constructionTypeOptions = masterData?.constructionTypes?.map((item: any) => ({
    label: item.constructionTypeName,
    value: item.constructionTypeId,
  })) || [];

  const waterSourceOptions = masterData?.waterSources?.map((item: any) => ({
    label: item.waterSourceName,
    value: item.waterSourceId,
  })) || [];

  const disposalTypeOptions = masterData?.disposalTypes?.map((item: any) => ({
    label: item.disposalTypeName,
    value: item.disposalTypeId,
  })) || [];

  // Integer IDs for SurveyTypeMaster (replace with real IDs from your DB/seed)
  const SURVEY_TYPE_IDS = {
    Residential: 1,
    'Non-Residential': 2,
    Mixed: 3,
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
    responseTypeId: 0,
    oldHouseNumber: '',
    electricityConsumerName: '',
    waterSewerageConnectionNumber: '',
    respondentName: '',
    respondentStatusId: 0,
    ownerName: '',
    fatherHusbandName: '',
    mobileNumber: '',
    aadharNumber: '',
    propertyLatitude: '',
    propertyLongitude: '',
    assessmentYear: '',
    propertyTypeId: 0,
    buildingName: '',
    roadTypeId: 0,
    constructionYear: '',
    constructionTypeId: 0,
    addressRoadName: '',
    locality: '',
    pinCode: '',
    landmark: '',
    fourWayEast: '',
    fourWayWest: '',
    fourWayNorth: '',
    fourWaySouth: '',
    newWard: '',
    waterSourceId: 0,
    rainWaterHarvestingSystem: '',
    plantation: '',
    parking: '',
    pollution: '',
    pollutionMeasurementTaken: '',
    waterSupplyWithin200Meters: '',
    sewerageLineWithin100Meters: '',
    disposalTypeId: 0,
    totalPlotArea: '',
    builtupAreaOfGroundFloor: '',
    remarks: '',
  });

  const handleInputChange = (name: string, value: string | boolean | number) => {
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

    const firstMissingField = requiredFields.find(field => {
      const value = formData[field.key];
      // Check for number fields (non-zero) or string fields (non-empty)
      if (typeof value === 'number') {
        return value === 0;
      } else {
        return !value;
      }
    });

    if (firstMissingField) {
      Alert.alert('Validation Error', `${firstMissingField.label} is required.`);
      // Scroll to the field
      if (fieldRefs.current[firstMissingField.key]) {
        fieldRefs.current[firstMissingField.key]?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          },
          () => {}
        );
      }
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
          surveyTypeId: SURVEY_TYPE_IDS[surveyTypeKey],
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading master data...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
    color: '#374151',
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
  },
});
