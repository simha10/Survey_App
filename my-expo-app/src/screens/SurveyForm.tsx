import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Alert, findNodeHandle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { saveSurveyLocally, getLocalSurvey } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllMasterData } from '../services/masterDataService';

interface FormData {
  ulbId: string;
  zoneId: string;
  wardId: string;
  mohallaId: string;
  parcelId: string | number;
  mapId: string | number;
  gisId: string;
  subGisId: string;
  responseTypeId: number;
  oldHouseNumber: string;
  electricityConsumerName: string;
  waterSewerageConnectionNumber: string;
  respondentName: string;
  respondentStatusId: number;
  ownerName: string;
  fatherHusbandName: string;
  mobileNumber: string;
  aadharNumber: string;
  propertyLatitude: string | number;
  propertyLongitude: string | number;
  assessmentYear: string;
  propertyTypeId: number;
  buildingName: string;
  roadTypeId: number;
  constructionYear: string;
  constructionTypeId: number;
  addressRoadName: string;
  locality: string;
  pinCode: string | number;
  landmark: string;
  fourWayEast: string;
  fourWayWest: string;
  fourWayNorth: string;
  fourWaySouth: string;
  newWardNumber: string;
  waterSourceId: number;
  rainWaterHarvestingSystem: string;
  plantation: string;
  parking: string;
  pollution: string;
  pollutionMeasurementTaken: string;
  waterSupplyWithin200Meters: string;
  sewerageLineWithin100Meters: string;
  disposalTypeId: number;
  totalPlotArea: string | number;
  builtupAreaOfGroundFloor: string | number;
  remarks: string;
}

export default function SurveyForm({ route }: any) {
  let { surveyType, surveyData: initialSurveyData, editMode, surveyId } = route.params as { surveyType: string, surveyData?: any, editMode?: boolean, surveyId?: string };
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

  // Integer IDs for SurveyTypeMaster (replace with real IDs from your DB/seed)
  const SURVEY_TYPE_IDS = {
    Residential: 1,
    'Non-Residential': 2,
    Mixed: 3,
  };

  const [formData, setFormData] = useState<FormData>({
    // Default initial state
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
    assessmentYear: new Date().getFullYear().toString(),
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
    newWardNumber: '',
    waterSourceId: 0,
    rainWaterHarvestingSystem: 'NO',
    plantation: 'NO',
    parking: 'NO',
    pollution: 'NO',
    pollutionMeasurementTaken: '',
    waterSupplyWithin200Meters: 'NO',
    sewerageLineWithin100Meters: 'NO',
    disposalTypeId: 0,
    totalPlotArea: '',
    builtupAreaOfGroundFloor: '',
    remarks: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllMasterData();
        setMasterData(data);
        
        let surveyToLoad = null;
        if (editMode && initialSurveyData) {
          surveyToLoad = initialSurveyData;
        } else if (editMode && surveyId) {
          const localSurvey = await getLocalSurvey(surveyId);
          if (localSurvey && !Array.isArray(localSurvey)) {
            surveyToLoad = localSurvey.data;
          }
        }
        
        if (surveyToLoad) {
          const flatData = {
            ...surveyToLoad.surveyDetails,
            ...surveyToLoad.propertyDetails,
            ...surveyToLoad.ownerDetails,
            ...surveyToLoad.locationDetails,
            ...surveyToLoad.otherDetails,
          };
          setFormData(prev => ({ ...prev, ...flatData }));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        Alert.alert('Error', 'Could not load survey data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [editMode, surveyId, initialSurveyData]);

  const createDropdownOptions = (items: any[], labelKey: string, valueKey: string) => {
    if (!items) return [{ label: 'No selection', value: 0 }];
    return items.map(item => ({
      label: item[labelKey],
      value: item[valueKey],
    }));
  };

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

  const handleInputChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields: { key: keyof FormData; label: string }[] = [
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
      { key: 'addressRoadName', label: 'Address/Road Name' },
      { key: 'locality', label: 'Locality' },
      { key: 'pinCode', label: 'PIN Code' },
      { key: 'waterSourceId', label: 'Source of Water' },
      { key: 'rainWaterHarvestingSystem', label: 'Rain Water Harvesting' },
      { key: 'waterSupplyWithin200Meters', label: 'Water Supply within 200m' },
      { key: 'sewerageLineWithin100Meters', label: 'Sewerage Line within 100m' },
      { key: 'disposalTypeId', label: 'Disposal Type' },
      { key: 'totalPlotArea', label: 'Total Plot Area' },
      { key: 'builtupAreaOfGroundFloor', label: 'Built-up Area of Ground Floor' },
      { key: 'newWardNumber', label: 'New Ward Number' },
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

  const transformDataForSaving = (data: FormData) => {
    const transformedData = { ...data };

    // Handle numeric conversions, treating empty strings as null
    const numericFields: (keyof FormData)[] = [
      'mapId', 'responseTypeId', 'respondentStatusId', 'propertyTypeId',
      'roadTypeId', 'constructionTypeId', 'pinCode', 'waterSourceId',
      'disposalTypeId', 'totalPlotArea', 'builtupAreaOfGroundFloor',
      'propertyLatitude', 'propertyLongitude'
    ];

    numericFields.forEach(field => {
      const value = transformedData[field];
      if (value === '' || value === null || value === undefined) {
        (transformedData[field] as any) = null;
      } else if (typeof value === 'string') {
        (transformedData[field] as any) = Number(value);
      }
    });
    
    // Handle optional Parcel ID
    if (transformedData.parcelId === '' || transformedData.parcelId === null || transformedData.parcelId === undefined) {
        transformedData.parcelId = null as any;
    } else if (typeof transformedData.parcelId === 'string') {
        transformedData.parcelId = Number(transformedData.parcelId);
    }

    // Handle optional string fields, converting empty to null
    const optionalStringFields: (keyof FormData)[] = [
        'subGisId', 'electricityConsumerName', 'waterSewerageConnectionNumber', 
        'mobileNumber', 'aadharNumber', 'buildingName', 'addressRoadName',
        'landmark', 'fourWayEast', 'fourWayWest', 'fourWayNorth', 'fourWaySouth',
        'pollutionMeasurementTaken', 'remarks'
    ];

    optionalStringFields.forEach(field => {
        if (transformedData[field] === '') {
            (transformedData[field] as any) = null;
        }
    });

    return transformedData;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        Alert.alert('Error', 'User not authenticated. Please log in again.');
        return;
      }
      const user = JSON.parse(userJson);
      const uploadedById = user.userId || user.id;

      if (!uploadedById) {
        Alert.alert('Error', 'Could not determine surveyor ID.');
        return;
      }

      const processedData = transformDataForSaving(formData);

      // Build DTO as per backend schema
      const surveyDataPayload = {
        surveyDetails: {
          ulbId: processedData.ulbId,
          zoneId: processedData.zoneId,
          wardId: processedData.wardId,
          mohallaId: processedData.mohallaId,
          surveyTypeId: SURVEY_TYPE_IDS[surveyTypeKey],
          entryDate: new Date().toISOString(),
          parcelId: processedData.parcelId,
          mapId: processedData.mapId,
          gisId: processedData.gisId,
          subGisId: processedData.subGisId,
        },
        propertyDetails: {
          responseTypeId: processedData.responseTypeId,
          oldHouseNumber: processedData.oldHouseNumber,
          electricityConsumerName: processedData.electricityConsumerName,
          waterSewerageConnectionNumber: processedData.waterSewerageConnectionNumber,
          respondentName: processedData.respondentName,
          respondentStatusId: processedData.respondentStatusId,
        },
        ownerDetails: {
          ownerName: processedData.ownerName,
          fatherHusbandName: processedData.fatherHusbandName,
          mobileNumber: processedData.mobileNumber,
          aadharNumber: processedData.aadharNumber,
        },
        locationDetails: {
          propertyLatitude: processedData.propertyLatitude,
          propertyLongitude: processedData.propertyLongitude,
          assessmentYear: processedData.assessmentYear,
          propertyTypeId: processedData.propertyTypeId,
          buildingName: processedData.buildingName,
          roadTypeId: processedData.roadTypeId,
          constructionYear: processedData.constructionYear,
          constructionTypeId: processedData.constructionTypeId,
          addressRoadName: processedData.addressRoadName,
          locality: processedData.locality,
          pinCode: processedData.pinCode,
          landmark: processedData.landmark,
          fourWayEast: processedData.fourWayEast,
          fourWayWest: processedData.fourWayWest,
          fourWayNorth: processedData.fourWayNorth,
          fourWaySouth: processedData.fourWaySouth,
          newWardNumber: processedData.newWardNumber,
        },
        otherDetails: {
          waterSourceId: processedData.waterSourceId,
          rainWaterHarvestingSystem: processedData.rainWaterHarvestingSystem,
          plantation: processedData.plantation,
          parking: processedData.parking,
          pollution: processedData.pollution,
          pollutionMeasurementTaken: processedData.pollutionMeasurementTaken,
          waterSupplyWithin200Meters: processedData.waterSupplyWithin200Meters,
          sewerageLineWithin100Meters: processedData.sewerageLineWithin100Meters,
          disposalTypeId: processedData.disposalTypeId,
          totalPlotArea: processedData.totalPlotArea,
          builtupAreaOfGroundFloor: processedData.builtupAreaOfGroundFloor,
          remarks: processedData.remarks,
        },
        residentialPropertyAssessments: initialSurveyData?.residentialPropertyAssessments || [],
        nonResidentialPropertyAssessments: initialSurveyData?.nonResidentialPropertyAssessments || [],
      };

      let surveyToSave;

      if (editMode && surveyId) {
        const existingSurvey = await getLocalSurvey(surveyId);
        if (existingSurvey && !Array.isArray(existingSurvey)) {
          surveyToSave = {
            ...existingSurvey,
            data: surveyDataPayload,
          };
        } else {
           Alert.alert('Error', 'Original survey not found for editing.');
           return;
        }
      } else {
        surveyToSave = {
          id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          surveyType: surveyTypeKey,
          data: surveyDataPayload,
          createdAt: new Date().toISOString(),
          synced: false,
        };
      }
      
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
          <Text style={styles.loadingText}>Loading data...</Text>
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
            label="Mohalla"
            required
            items={mohallaOptions}
            onValueChange={(value: string) => handleInputChange('mohallaId', value)}
            value={formData.mohallaId}
          />
          <FormInput
            label="Parcel ID"
            onChangeText={(value: string) => handleInputChange('parcelId', value)}
            value={String(formData.parcelId ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Map ID"
            required
            onChangeText={(value: string) => handleInputChange('mapId', value)}
            value={String(formData.mapId ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="GIS ID"
            required
            onChangeText={(value: string) => handleInputChange('gisId', value)}
            value={formData.gisId}
          />
          <FormInput
            label="Sub-GIS ID"
            onChangeText={(value: string) => handleInputChange('subGisId', value)}
            value={String(formData.subGisId ?? '')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Property Details</Text>
          <FormDropdown
              label="Response Type"
              required
              items={createDropdownOptions(masterData?.responseTypes, 'responseTypeName', 'responseTypeId')}
              onValueChange={(value) => handleInputChange('responseTypeId', value)}
              value={formData.responseTypeId}
          />
          <FormInput
              label="Old House No."
              required
              onChangeText={(value) => handleInputChange('oldHouseNumber', value)}
              value={formData.oldHouseNumber}
          />
          <FormInput
            label="Electricity Consumer Name"
            onChangeText={(value) => handleInputChange('electricityConsumerName', value)}
            value={String(formData.electricityConsumerName ?? '')}
          />
          <FormInput
            label="Water Sewerage Connection No."
            onChangeText={(value) => handleInputChange('waterSewerageConnectionNumber', value)}
            value={String(formData.waterSewerageConnectionNumber ?? '')}
          />
          <FormInput
            label="Respondent Name"
            required
            onChangeText={(value) => handleInputChange('respondentName', value)}
            value={formData.respondentName}
          />
          <FormDropdown
            label="Respondent Status"
            required
            items={createDropdownOptions(masterData?.respondentStatuses, 'respondentStatusName', 'respondentStatusId')}
            onValueChange={(value) => handleInputChange('respondentStatusId', value)}
            value={formData.respondentStatusId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Owner Details</Text>
          <FormInput
            label="Owner Name"
            required
            onChangeText={(value) => handleInputChange('ownerName', value)}
            value={formData.ownerName}
          />
          <FormInput
            label="Father/Husband Name"
            required
            onChangeText={(value) => handleInputChange('fatherHusbandName', value)}
            value={formData.fatherHusbandName}
          />
          <FormInput
            label="Mobile Number"
            onChangeText={(value) => handleInputChange('mobileNumber', value)}
            value={String(formData.mobileNumber ?? '')}
            keyboardType="phone-pad"
          />
          <FormInput
            label="Aadhar Number"
            onChangeText={(value) => handleInputChange('aadharNumber', value)}
            value={String(formData.aadharNumber ?? '')}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Location Details</Text>
          <FormInput
            label="Latitude"
            onChangeText={(value: string) => handleInputChange('propertyLatitude', value)}
            value={String(formData.propertyLatitude ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Longitude"
            onChangeText={(value: string) => handleInputChange('propertyLongitude', value)}
            value={String(formData.propertyLongitude ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Assessment Year"
            value={formData.assessmentYear}
            editable={false}
          />
          <FormDropdown
            label="Property Type"
            required
            items={createDropdownOptions(masterData?.propertyTypes, 'propertyTypeName', 'propertyTypeId')}
            onValueChange={(value) => handleInputChange('propertyTypeId', value)}
            value={formData.propertyTypeId}
          />
          <FormInput
            label="Building Name"
            onChangeText={(value) => handleInputChange('buildingName', value)}
            value={String(formData.buildingName ?? '')}
          />
          <FormDropdown
            label="Road Type"
            required
            items={createDropdownOptions(masterData?.roadTypes, 'roadTypeName', 'roadTypeId')}
            onValueChange={(value) => handleInputChange('roadTypeId', value)}
            value={formData.roadTypeId}
          />
          <FormInput
            label="Construction Year"
            required
            onChangeText={(value) => handleInputChange('constructionYear', value)}
            value={formData.constructionYear}
            keyboardType="numeric"
          />
          <FormDropdown
            label="Construction Type"
            required
            items={createDropdownOptions(masterData?.constructionTypes, 'constructionTypeName', 'constructionTypeId')}
            onValueChange={(value) => handleInputChange('constructionTypeId', value)}
            value={formData.constructionTypeId}
          />
          <FormInput
            label="Address/Road Name"
            required
            onChangeText={(value: string) => handleInputChange('addressRoadName', value)}
            value={String(formData.addressRoadName ?? '')}
          />
          <FormInput
            label="Locality"
            required
            onChangeText={(value) => handleInputChange('locality', value)}
            value={formData.locality}
          />
          <FormInput
            label="PIN Code"
            required
            onChangeText={(value) => handleInputChange('pinCode', value)}
            value={String(formData.pinCode ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Landmark"
            onChangeText={(value) => handleInputChange('landmark', value)}
            value={String(formData.landmark ?? '')}
          />
          <FormInput
            label="Four Way-East"
            onChangeText={(value: string) => handleInputChange('fourWayEast', value)}
            value={String(formData.fourWayEast ?? '')}
          />
          <FormInput
            label="Four Way-West"
            onChangeText={(value: string) => handleInputChange('fourWayWest', value)}
            value={String(formData.fourWayWest ?? '')}
          />
          <FormInput
            label="Four Way-North"
            onChangeText={(value: string) => handleInputChange('fourWayNorth', value)}
            value={String(formData.fourWayNorth ?? '')}
          />
          <FormInput
            label="Four Way-South"
            onChangeText={(value: string) => handleInputChange('fourWaySouth', value)}
            value={String(formData.fourWaySouth ?? '')}
          />
          <FormInput 
            label="New Ward Number"
            required
            onChangeText={(value: string) => handleInputChange('newWardNumber', value)}
            value={formData.newWardNumber} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Other Details</Text>
          <FormDropdown
            label="Source of Water"
            required
            items={createDropdownOptions(masterData?.waterSources, 'waterSourceName', 'waterSourceId')}
            onValueChange={(value: string) => handleInputChange('waterSourceId', value)}
            value={formData.waterSourceId}
          />
          <FormDropdown
            label="Rain Water Harvesting"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('rainWaterHarvestingSystem', value)}
            value={formData.rainWaterHarvestingSystem}
          />

          {surveyType !== 'Residential' && (
            <>
              <FormDropdown
                label="Plantation Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string) => handleInputChange('plantation', value)}
                value={formData.plantation}
              />
              <FormDropdown
                label="Parking Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string) => handleInputChange('parking', value)}
                value={formData.parking}
              />
              <FormDropdown
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
            label="Water Supply within 200m"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('waterSupplyWithin200Meters', value)}
            value={formData.waterSupplyWithin200Meters}
          />
          <FormDropdown
            label="Sewerage Line within 100m"
            required
            items={yesNoOptions}
            onValueChange={(value: string) => handleInputChange('sewerageLineWithin100Meters', value)}
            value={formData.sewerageLineWithin100Meters}
          />
          <FormDropdown
            label="Disposal Type"
            required
            items={createDropdownOptions(masterData?.disposalTypes, 'disposalTypeName', 'disposalTypeId')}
            onValueChange={(value: string) => handleInputChange('disposalTypeId', value)}
            value={formData.disposalTypeId}
          />
          <FormInput
            label="Total Plot Area"
            required
            onChangeText={(value) => handleInputChange('totalPlotArea', value)}
            value={String(formData.totalPlotArea ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Built-up Area of Ground Floor"
            required
            onChangeText={(value) => handleInputChange('builtupAreaOfGroundFloor', value)}
            value={String(formData.builtupAreaOfGroundFloor ?? '')}
            keyboardType="numeric"
          />
          <FormInput
            label="Remarks"
            onChangeText={(value: string) => handleInputChange('remarks', value)}
            value={String(formData.remarks ?? '')}
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
