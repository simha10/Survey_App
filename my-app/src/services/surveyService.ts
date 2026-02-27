import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import { fetchAllMasterData } from './masterDataService';

export const submitSurvey = async (surveyData: any): Promise<any> => {
  try {
    // No need to manually get token, axios interceptor handles it
    const response = await api.post('/surveys/addSurvey', surveyData);
    return response.data;
  } catch (error: any) {
    let errorMsg = 'Failed to submit survey';
    if (error.response && error.response.data) {
      if (error.response.data.message) errorMsg = error.response.data.message;
      else if (error.response.data.errors && Array.isArray(error.response.data.errors))
        errorMsg = error.response.data.errors.map((e: any) => e.message).join(', ');
    } else if (error.message) {
      errorMsg = error.message;
    }
    console.error('Error submitting survey:', errorMsg);
    throw new Error(errorMsg);
  }
};

export const fetchSurveyorAssignments = async () => {
  try {
    const response = await api.get('/surveyor/my-assignments');
    return response.data;
  } catch (error: any) {
    let errorMsg = 'Failed to fetch assignments';
    if (error.response && error.response.data && error.response.data.error) {
      errorMsg = error.response.data.error;
    } else if (error.message) {
      errorMsg = error.message;
    }
    throw new Error(errorMsg);
  }
};

export const fetchMasterData = async () => {
  try {
    // Fetch real master data from the backend
    const masterData = await fetchAllMasterData();

    // Transform the data to match the expected format
    return {
      floorNumbers: masterData.floors.map((floor) => ({
        floorNumberId: floor.floorNumberId,
        floorNumberName: floor.floorNumberName,
      })),
      occupancyStatuses: masterData.occupancyStatuses.map((status) => ({
        occupancyStatusId: status.occupancyStatusId,
        occupancyStatusName: status.occupancyStatusName,
      })),
      constructionNatures: masterData.constructionNatures.map((nature) => ({
        constructionNatureId: nature.constructionNatureId,
        constructionNatureName: nature.constructionNatureName,
      })),
      nrPropertyCategories: masterData.nrPropertyCategories.map((category) => ({
        propertyCategoryId: category.propertyCategoryId,
        propertyCategoryName: category.propertyCategoryName,
      })),
      // Note: Sub-categories will be fetched dynamically based on selected category
      nrPropertySubCategories: [], // This will be populated when a category is selected
    };
  } catch (error) {
    console.error('Error fetching master data:', error);
    // Fallback to dummy data if API fails
    return {
      floorNumbers: [
        { floorNumberId: 1, floorNumberName: 'Ground Floor' },
        { floorNumberId: 2, floorNumberName: 'First Floor' },
        { floorNumberId: 3, floorNumberName: 'Second Floor' },
      ],
      occupancyStatuses: [
        { occupancyStatusId: 1, occupancyStatusName: 'Self Occupied' },
        { occupancyStatusId: 2, occupancyStatusName: 'Rented' },
        { occupancyStatusId: 3, occupancyStatusName: 'Mix' },
      ],
      constructionNatures: [
        { constructionNatureId: 1, constructionNatureName: 'Pucckaa RCC/RB Roof' },
        { constructionNatureId: 2, constructionNatureName: 'Other Pucckaa' },
        { constructionNatureId: 3, constructionNatureName: 'Kucchhaa' },
      ],
      nrPropertyCategories: [
        { propertyCategoryId: 1, propertyCategoryName: 'Shops' },
        { propertyCategoryId: 2, propertyCategoryName: 'Offices' },
      ],
      nrPropertySubCategories: [
        { subCategoryId: 1, subCategoryName: 'Retail', propertyCategoryId: 1 },
        { subCategoryId: 2, subCategoryName: 'Wholesale', propertyCategoryId: 1 },
        { subCategoryId: 3, subCategoryName: 'Corporate', propertyCategoryId: 2 },
      ],
    };
  }
};

export const surveyService = {
  createSurvey: async (surveyData: any) => {
    const response = await api.post('/surveys', surveyData);
    return response.data;
  },

  getSurveys: async (params?: any) => {
    const response = await api.get('/surveys', { params });
    return response.data;
  },

  getSurveyById: async (id: string) => {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  },

  updateSurvey: async (id: string, surveyData: any) => {
    const response = await api.put(`/surveys/${id}`, surveyData);
    return response.data;
  },

  deleteSurvey: async (id: string) => {
    const response = await api.delete(`/surveys/${id}`);
    return response.data;
  },

  submitSurvey: async (id: string) => {
    const response = await api.post(`/surveys/${id}/submit`);
    return response.data;
  },

  getSurveyStats: async (params?: any) => {
    const response = await api.get('/surveys/stats', { params });
    return response.data;
  },
};

