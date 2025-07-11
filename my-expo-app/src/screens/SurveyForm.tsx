import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Alert, findNodeHandle, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/FormInput';
import FormDropdown from '../components/FormDropdown';
import { saveSurveyLocally, getLocalSurvey, getUnsyncedSurveys, getMasterData } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Use assignment data for ULB, Zone, Ward, and Mohalla options
  const [assignment, setAssignment] = useState<any>(null);

  // Add surveyId state to track current survey being edited or created
  const [surveyIdState, setSurveyIdState] = useState<string | undefined>(surveyId);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('primaryAssignment');
      if (json) setAssignment(JSON.parse(json));
    })();
  }, []);

  // Integer IDs for SurveyTypeMaster (replace with real IDs from your DB/seed)
  const SURVEY_TYPE_IDS = {
    Residential: 1,
    'Non-Residential': 2,
    Mixed: 3,
  };

  const [formData, setFormData] = useState<FormData>({
    // Default initial state
    ulbId: assignment?.ulb ? assignment.ulb.ulbId : '',
    zoneId: assignment?.zone ? assignment.zone.zoneId : '',
    wardId: assignment?.ward ? assignment.ward.wardId : '',
    mohallaId: assignment?.mohallas && assignment.mohallas.length > 0 ? assignment.mohallas[0].mohallaId : '',
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
        const data = await getMasterData();
        setMasterData(data);
        let surveyToLoad = null;
        let loadedSurveyId = surveyId;
        if (editMode && surveyId) {
          const localSurvey = await getLocalSurvey(surveyId);
          if (localSurvey && !Array.isArray(localSurvey)) {
            surveyToLoad = localSurvey.data;
            loadedSurveyId = localSurvey.id;
          }
        } else if (editMode && initialSurveyData) {
          surveyToLoad = initialSurveyData;
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
        // Always set surveyId state for use in save
        if (loadedSurveyId) {
          setSurveyIdState(loadedSurveyId);
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

  useEffect(() => {
    if (assignment) {
      setFormData(prev => ({
        ...prev,
        ulbId: assignment.ulb ? assignment.ulb.ulbId : '',
        zoneId: assignment.zone ? assignment.zone.zoneId : '',
        wardId: assignment.ward ? assignment.ward.wardId : '',
        mohallaId: assignment.mohallas && assignment.mohallas.length > 0 ? assignment.mohallas[0].mohallaId : '',
      }));
    }
  }, [assignment]);

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
      { key: 'respondentName', label: 'Respondent Name' },
      { key: 'respondentStatusId', label: 'Respondent Status' },
      { key: 'ownerName', label: 'Owner Name' },
      { key: 'fatherHusbandName', label: 'Father/Husband Name' },
      { key: 'propertyTypeId', label: 'Property Type' },
      { key: 'roadTypeId', label: 'Road Type' },
      { key: 'constructionYear', label: 'Construction Year' },
      { key: 'constructionTypeId', label: 'Construction Type' },
      { key: 'addressRoadName', label: 'Address/Road Name' },
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

    if (surveyTypeKey === 'Non-Residential') {
      // Remove propertyTypeId if present
      const idx = requiredFields.findIndex(f => f.key === 'propertyTypeId');
      if (idx !== -1) requiredFields.splice(idx, 1);
    }

    const firstMissingField = requiredFields.find(field => {
      const value = formData[field.key];
      // For propertyTypeId, treat 0 as missing for Residential/Mixed
      if (field.key === 'propertyTypeId' && (surveyTypeKey === 'Residential' || surveyTypeKey === 'Mixed')) {
        return value === 0 || value === undefined || value === null;
      }
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
    try {
      if (!validateForm()) return;
      const toNumber = (v: any) => v === '' || v === null || v === undefined ? undefined : Number(v);
      const surveyTypeId = SURVEY_TYPE_IDS[surveyTypeKey];
      const surveyDetails = {
        ulbId: formData.ulbId,
        zoneId: formData.zoneId,
        wardId: formData.wardId,
        mohallaId: formData.mohallaId,
        surveyTypeId, // required by backend
        parcelId: toNumber(formData.parcelId),
        mapId: toNumber(formData.mapId),
        gisId: formData.gisId,
        subGisId: formData.subGisId,
        entryDate: new Date().toISOString(),
      };
      const propertyDetails = {
        responseTypeId: formData.responseTypeId,
        oldHouseNumber: formData.oldHouseNumber,
        electricityConsumerName: formData.electricityConsumerName,
        waterSewerageConnectionNumber: formData.waterSewerageConnectionNumber,
        respondentName: formData.respondentName,
        respondentStatusId: formData.respondentStatusId,
      };
      const ownerDetails = {
        ownerName: formData.ownerName,
        fatherHusbandName: formData.fatherHusbandName,
        mobileNumber: formData.mobileNumber,
        aadharNumber: formData.aadharNumber && formData.aadharNumber.length === 12 ? formData.aadharNumber : undefined,
      };
      const locationDetails = {
        propertyLatitude: toNumber(formData.propertyLatitude),
        propertyLongitude: toNumber(formData.propertyLongitude),
        assessmentYear: formData.assessmentYear,
        ...(surveyTypeKey === 'Residential' || surveyTypeKey === 'Mixed'
          ? { propertyTypeId: formData.propertyTypeId }
          : {}),
        buildingName: formData.buildingName,
        roadTypeId: formData.roadTypeId,
        constructionYear: formData.constructionYear,
        constructionTypeId: formData.constructionTypeId,
        addressRoadName: formData.addressRoadName,
        locality: formData.locality,
        pinCode: toNumber(formData.pinCode),
        landmark: formData.landmark,
        fourWayEast: formData.fourWayEast,
        fourWayWest: formData.fourWayWest,
        fourWayNorth: formData.fourWayNorth,
        fourWaySouth: formData.fourWaySouth,
        newWardNumber: formData.newWardNumber,
      };
      const otherDetails = {
        waterSourceId: formData.waterSourceId,
        rainWaterHarvestingSystem: formData.rainWaterHarvestingSystem,
        plantation: formData.plantation,
        parking: formData.parking,
        pollution: formData.pollution,
        pollutionMeasurementTaken: formData.pollutionMeasurementTaken,
        waterSupplyWithin200Meters: formData.waterSupplyWithin200Meters,
        sewerageLineWithin100Meters: formData.sewerageLineWithin100Meters,
        disposalTypeId: formData.disposalTypeId,
        totalPlotArea: toNumber(formData.totalPlotArea),
        builtupAreaOfGroundFloor: toNumber(formData.builtupAreaOfGroundFloor),
        remarks: formData.remarks,
      };
      let idToUse = surveyIdState || surveyId || (editMode && route.params?.surveyId) || undefined;
      let surveyToSave;
      if (editMode && idToUse) {
        // Update existing survey
        const allSurveys = await getUnsyncedSurveys();
        const idx = allSurveys.findIndex((s: any) => s.id === idToUse);
        if (idx > -1) {
          surveyToSave = {
            ...allSurveys[idx],
            data: {
              surveyDetails,
              propertyDetails,
              ownerDetails,
              locationDetails,
              otherDetails,
              // preserve any floor details or extra data
              ...allSurveys[idx].data,
            },
            synced: false,
            status: 'incomplete',
          };
          await saveSurveyLocally(surveyToSave);
          Alert.alert('Updated', 'Survey updated locally.');
        } else {
          // fallback: treat as new
          idToUse = `survey_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
          surveyToSave = {
            id: idToUse,
            data: {
              surveyDetails,
              propertyDetails,
              ownerDetails,
              locationDetails,
              otherDetails,
            },
            synced: false,
            createdAt: new Date().toISOString(),
            surveyType: surveyTypeKey,
            status: 'incomplete',
          };
          await saveSurveyLocally(surveyToSave);
          Alert.alert('Saved', 'Survey saved locally.');
        }
      } else {
        // Create new survey
        idToUse = `survey_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        surveyToSave = {
          id: idToUse,
          data: {
            surveyDetails,
            propertyDetails,
            ownerDetails,
            locationDetails,
            otherDetails,
          },
          synced: false,
          createdAt: new Date().toISOString(),
          surveyType: surveyTypeKey,
          status: 'incomplete',
        };
        await saveSurveyLocally(surveyToSave);
        Alert.alert('Saved', 'Survey saved locally.');
      }
      setSurveyIdState(idToUse); // always update state
      const selectedMohalla = assignment?.mohallas?.find((m: any) => m.mohallaId === formData.mohallaId);
      const mohallaName = selectedMohalla ? selectedMohalla.mohallaName : '';
      (navigation as any).navigate('SurveyIntermediate', { surveyId: idToUse, surveyType: surveyTypeKey, mohallaName });
    } catch (e) {
      Alert.alert('Error', 'Failed to save survey locally.');
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
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBackButton}>
          <Text style={styles.topBackArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{`New ${surveyType} Survey`}</Text>
      </View>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Survey Details</Text>
          <FormInput label="ULB" value={assignment?.ulb?.ulbName || ''} editable={false} />
          <FormInput label="Zone" value={assignment?.zone?.zoneName || ''} editable={false} />
          <FormInput label="Ward" value={assignment?.ward?.wardName || ''} editable={false} />
          <FormDropdown
            label="Mohalla"
            required
            items={assignment?.mohallas?.map((m: any) => ({ label: m.mohallaName, value: m.mohallaId })) || []}
            onValueChange={(value: string | number) => handleInputChange('mohallaId', value)}
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
          {/* Property Type: Only for Residential and Mixed */}
          {(surveyTypeKey === 'Residential' || surveyTypeKey === 'Mixed') && (
            <FormDropdown
              label="Property Type"
              required
              items={createDropdownOptions(masterData?.propertyTypes, 'propertyTypeName', 'propertyTypeId')}
              onValueChange={(value) => handleInputChange('propertyTypeId', value)}
              value={formData.propertyTypeId}
            />
          )}
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
            onValueChange={(value: string | number) => handleInputChange('waterSourceId', value)}
            value={formData.waterSourceId}
          />
          <FormDropdown
            label="Rain Water Harvesting"
            required
            items={yesNoOptions}
            onValueChange={(value: string | number) => handleInputChange('rainWaterHarvestingSystem', value)}
            value={formData.rainWaterHarvestingSystem}
          />

          {surveyType !== 'Residential' && (
            <>
              <FormDropdown
                label="Plantation Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string | number) => handleInputChange('plantation', value)}
                value={formData.plantation}
              />
              <FormDropdown
                label="Parking Available"
                required
                items={yesNoOptions}
                onValueChange={(value: string | number) => handleInputChange('parking', value)}
                value={formData.parking}
              />
              <FormDropdown
                label="Pollution Created"
                required
                items={yesNoOptions}
                onValueChange={(value: string | number) => handleInputChange('pollution', value)}
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
            onValueChange={(value: string | number) => handleInputChange('waterSupplyWithin200Meters', value)}
            value={formData.waterSupplyWithin200Meters}
          />
          <FormDropdown
            label="Sewerage Line within 100m"
            required
            items={yesNoOptions}
            onValueChange={(value: string | number) => handleInputChange('sewerageLineWithin100Meters', value)}
            value={formData.sewerageLineWithin100Meters}
          />
          <FormDropdown
            label="Disposal Type"
            required
            items={createDropdownOptions(masterData?.disposalTypes, 'disposalTypeName', 'disposalTypeId')}
            onValueChange={(value: string | number) => handleInputChange('disposalTypeId', value)}
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
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
    height: 48,
  },
  topBackButton: {
    position: 'absolute',
    left: 8,
    height: '500%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    zIndex: 11,
  },
  topBackArrow: {
    fontSize: 24,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  topHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
});
