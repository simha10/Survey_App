import AsyncStorage from '@react-native-async-storage/async-storage';
import { SurveyData } from '../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const submitSurvey = async (surveyData: SurveyData): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_URL}/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit survey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};

export const fetchSurveyorAssignments = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) throw new Error('No auth token found');
  const response = await fetch(`${API_URL}/surveyor/my-assignments`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch assignments');
  return response.json();
};

export const fetchMasterData = async () => {
  // Dummy master data for development/testing
  return {
    floorNumbers: [
      { floorNumberId: '1', floorNumberName: 'Ground Floor' },
      { floorNumberId: '2', floorNumberName: 'First Floor' },
      { floorNumberId: '3', floorNumberName: 'Second Floor' },
    ],
    occupancyStatuses: [
      { occupancyStatusId: '1', occupancyStatusName: 'Self Occupied' },
      { occupancyStatusId: '2', occupancyStatusName: 'Rented' },
      { occupancyStatusId: '3', occupancyStatusName: 'Mix' },
    ],
    constructionNatures: [
      { constructionNatureId: '1', constructionNatureName: 'Pucckaa RCC/RB Roof' },
      { constructionNatureId: '2', constructionNatureName: 'Other Pucckaa' },
      { constructionNatureId: '3', constructionNatureName: 'Kucchhaa' },
    ],
    nrPropertyCategories: [
      { propertyCategoryId: '1', propertyCategoryName: 'Shops' },
      { propertyCategoryId: '2', propertyCategoryName: 'Offices' },
    ],
    nrPropertySubCategories: [
      { subCategoryId: '1', subCategoryName: 'Retail', propertyCategoryId: '1' },
      { subCategoryId: '2', subCategoryName: 'Wholesale', propertyCategoryId: '1' },
      { subCategoryId: '3', subCategoryName: 'Corporate', propertyCategoryId: '2' },
    ],
  };
};