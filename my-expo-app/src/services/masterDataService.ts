import api from '../api/axiosConfig';

export interface MasterDataItem {
  [key: string]: any;
}

export interface MasterDataResponse {
  responseTypes: MasterDataItem[];
  propertyTypes: MasterDataItem[];
  respondentStatuses: MasterDataItem[];
  roadTypes: MasterDataItem[];
  constructionTypes: MasterDataItem[];
  waterSources: MasterDataItem[];
  disposalTypes: MasterDataItem[];
  floors: MasterDataItem[];
  nrPropertyCategories: MasterDataItem[];
  constructionNatures: MasterDataItem[];
  occupancyStatuses: MasterDataItem[];
  surveyTypes: MasterDataItem[];
}

export interface NrPropertySubCategory {
  subCategoryId: number;
  subCategoryNumber: number;
  subCategoryName: string;
  propertyCategoryId: number;
}

// Fetch all master data at once
export const fetchAllMasterData = async (): Promise<MasterDataResponse> => {
  try {
    const response = await api.get('/master-data/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all master data:', error);
    throw error;
  }
};

// Individual master data endpoints
export const fetchResponseTypes = async () => {
  try {
    const response = await api.get('/master-data/response-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching response types:', error);
    throw error;
  }
};

export const fetchPropertyTypes = async () => {
  try {
    const response = await api.get('/master-data/property-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching property types:', error);
    throw error;
  }
};

export const fetchRespondentStatuses = async () => {
  try {
    const response = await api.get('/master-data/respondent-statuses');
    return response.data;
  } catch (error) {
    console.error('Error fetching respondent statuses:', error);
    throw error;
  }
};

export const fetchRoadTypes = async () => {
  try {
    const response = await api.get('/master-data/road-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching road types:', error);
    throw error;
  }
};

export const fetchConstructionTypes = async () => {
  try {
    const response = await api.get('/master-data/construction-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching construction types:', error);
    throw error;
  }
};

export const fetchWaterSources = async () => {
  try {
    const response = await api.get('/master-data/water-sources');
    return response.data;
  } catch (error) {
    console.error('Error fetching water sources:', error);
    throw error;
  }
};

export const fetchDisposalTypes = async () => {
  try {
    const response = await api.get('/master-data/disposal-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching disposal types:', error);
    throw error;
  }
};

export const fetchFloors = async () => {
  try {
    const response = await api.get('/master-data/floors');
    return response.data;
  } catch (error) {
    console.error('Error fetching floors:', error);
    throw error;
  }
};

export const fetchNrPropertyCategories = async () => {
  try {
    const response = await api.get('/master-data/nr-property-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching NR property categories:', error);
    throw error;
  }
};

export const fetchNrPropertySubCategories = async (categoryId?: number) => {
  try {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get('/master-data/nr-property-sub-categories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching NR property sub-categories:', error);
    throw error;
  }
};

export const fetchConstructionNatures = async () => {
  try {
    const response = await api.get('/master-data/construction-natures');
    return response.data;
  } catch (error) {
    console.error('Error fetching construction natures:', error);
    throw error;
  }
};

export const fetchOccupancyStatuses = async () => {
  try {
    const response = await api.get('/master-data/occupancy-statuses');
    return response.data;
  } catch (error) {
    console.error('Error fetching occupancy statuses:', error);
    throw error;
  }
};

export const fetchSurveyTypes = async () => {
  try {
    const response = await api.get('/master-data/survey-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching survey types:', error);
    throw error;
  }
}; 