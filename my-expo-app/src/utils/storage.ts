import AsyncStorage from '@react-native-async-storage/async-storage';

const SURVEYS_STORAGE_KEY = 'surveys';

export interface SurveyData {
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

export const saveSurveyLocally = async (survey: SurveyData): Promise<void> => {
  try {
    const existingSurveys = await getLocalSurveys();
    const updatedSurveys = [...existingSurveys, survey];
    const jsonValue = JSON.stringify(updatedSurveys);
    await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save the survey to storage', e);
    throw e;
  }
};

export const getLocalSurveys = async (): Promise<SurveyData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SURVEYS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch surveys from storage', e);
    return [];
  }
};

export const getLocalSurvey = async (surveyId?: string): Promise<SurveyData | SurveyData[]> => {
  try {
    const surveys = await getLocalSurveys();
    if (surveyId) {
      const found = surveys.find(survey => survey.id === surveyId);
      return found ? found : ({} as SurveyData);
    }
    return surveys;
  } catch (e) {
    console.error('Failed to fetch survey from storage', e);
    return surveyId ? ({} as SurveyData) : [];
  }
};

export const updateLocalSurvey = async (surveyId: string, updatedSurvey: SurveyData): Promise<void> => {
  try {
    const surveys = await getLocalSurveys();
    const updatedSurveys = surveys.map(survey => 
      survey.id === surveyId ? updatedSurvey : survey
    );
    const jsonValue = JSON.stringify(updatedSurveys);
    await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to update survey in storage', e);
    throw e;
  }
};

export const deleteLocalSurvey = async (surveyId: string): Promise<void> => {
  try {
    const surveys = await getLocalSurveys();
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
    const jsonValue = JSON.stringify(updatedSurveys);
    await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to delete survey from storage', e);
    throw e;
  }
};

export const clearLocalSurveys = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SURVEYS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear surveys from storage', e);
    throw e;
  }
};

export const isSurveyInProgress = (survey: SurveyData): boolean => {
  if (!survey || survey.synced) return false;
  if (!survey.data) return false;
  const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails } = survey.data;
  // All main blocks must exist and not be empty
  if (!surveyDetails || !propertyDetails || !ownerDetails || !locationDetails || !otherDetails) return false;
  // Optionally, check for required fields in surveyDetails, etc.
  return true;
};

export const getOngoingSurvey = async (): Promise<SurveyData | null> => {
  try {
    const surveys = await getLocalSurveys();
    // Only return a survey that is truly in progress
    return surveys.find(isSurveyInProgress) || null;
  } catch (e) {
    console.error('Failed to fetch ongoing survey from storage', e);
    return null;
  }
};