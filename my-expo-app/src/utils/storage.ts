import AsyncStorage from '@react-native-async-storage/async-storage';

const SURVEYS_STORAGE_KEY = 'surveys';

export interface SurveyData {
  // This should match the structure of your survey form data
  id: string; // A unique ID for the survey, e.g., a timestamp or UUID
  surveyType: 'Residential' | 'Non-Residential' | 'Mixed';
  [key: string]: any;
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

export const clearLocalSurveys = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SURVEYS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear surveys from storage', e);
    throw e;
  }
}; 