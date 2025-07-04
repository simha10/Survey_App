import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import LZString from 'lz-string';
import api from '../api/axiosConfig';

const UNSYNCED_SURVEYS_KEY = 'unsyncedSurveys';
const MASTER_DATA_KEY = 'masterData';
const USER_ASSIGNMENTS_KEY = 'userAssignments';
const SELECTED_ASSIGNMENT_KEY = 'selectedAssignment';

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
  status?: 'incomplete' | 'submitted';
}

/**
 * Save master data to AsyncStorage
 */
export const saveMasterData = async (data: any): Promise<void> => {
  try {
    const compressed = LZString.compressToUTF16(JSON.stringify(data));
    await AsyncStorage.setItem(MASTER_DATA_KEY, compressed);
  } catch (e) {
    console.error('Failed to save master data', e);
    throw e;
  }
};

/**
 * Get master data from AsyncStorage
 */
export const getMasterData = async (): Promise<any> => {
  try {
    const compressed = await AsyncStorage.getItem(MASTER_DATA_KEY);
    if (!compressed) return null;
    const json = LZString.decompressFromUTF16(compressed);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to get master data', e);
    return null;
  }
};

/**
 * Save user assignments to AsyncStorage
 */
export const saveAssignments = async (assignments: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (e) {
    console.error('Failed to save assignments', e);
    throw e;
  }
};

/**
 * Get user assignments from AsyncStorage
 */
export const getAssignments = async (): Promise<any> => {
  try {
    const json = await AsyncStorage.getItem(USER_ASSIGNMENTS_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to get assignments', e);
    return null;
  }
};

/**
 * Sync all unsynced surveys to backend, remove on success, return sync summary
 * @param {string} apiBaseUrl - Backend API base URL
 * @param {string} token - Auth token
 * @returns {Promise<{success: number, failed: number}>}
 */
export const syncSurveysToBackend = async (apiBaseUrl: string, token: string): Promise<{success: number, failed: number}> => {
  const unsynced = (await getUnsyncedSurveys()).filter(s => s.status === 'submitted');
  let success = 0, failed = 0;
  for (const survey of unsynced) {
    try {
      // Use axios instance for consistent auth and error handling
      const res = await api.post('/surveys/addSurvey', survey.data);
      if (res.status === 200 || res.status === 201) {
        await removeUnsyncedSurvey(survey.id);
        success++;
      } else {
        failed++;
      }
    } catch (e) {
      console.error('Failed to sync survey', e);
      failed++;
    }
  }
  return { success, failed };
};

/**
 * Set selected assignment in AsyncStorage
 * @param {any} assignment - Assignment object or ID
 */
export const setSelectedAssignment = async (assignment: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(SELECTED_ASSIGNMENT_KEY, JSON.stringify(assignment));
  } catch (e) {
    console.error('Failed to set selected assignment', e);
    throw e;
  }
};

/**
 * Get selected assignment from AsyncStorage
 */
export const getSelectedAssignment = async (): Promise<any> => {
  try {
    const json = await AsyncStorage.getItem(SELECTED_ASSIGNMENT_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to get selected assignment', e);
    return null;
  }
};

/**
 * Save a survey locally to unsyncedSurveys (compressed)
 */
export const saveSurveyLocally = async (survey: any): Promise<void> => {
  try {
    const existing = await getUnsyncedSurveys();
    const idx = existing.findIndex((s: any) => s.id === survey.id);
    let updated;
    if (idx > -1) {
      const prevStatus = existing[idx].status || 'incomplete';
      updated = [...existing];
      updated[idx] = { ...survey, status: survey.status || prevStatus };
    } else {
      updated = [...existing, { ...survey, status: survey.status || 'incomplete' }];
    }
    // Only store minimal fields
    const minimal = updated.map((s: any) => ({
      id: s.id,
      data: s.data,
      synced: !!s.synced,
      createdAt: s.createdAt,
      surveyType: s.surveyType,
      status: s.status || 'incomplete',
    }));
    const compressed = LZString.compressToUTF16(JSON.stringify(minimal));
    await AsyncStorage.setItem(UNSYNCED_SURVEYS_KEY, compressed);
  } catch (e) {
    console.error('Failed to save unsynced survey', e);
    throw e;
  }
};

/**
 * Get all unsynced surveys from local storage (decompressed)
 */
export const getUnsyncedSurveys = async (): Promise<any[]> => {
  try {
    const compressed = await AsyncStorage.getItem(UNSYNCED_SURVEYS_KEY);
    if (!compressed) return [];
    let json = null;
    try {
      json = LZString.decompressFromUTF16(compressed);
      if (!json || typeof json !== 'string' || json.trim() === '') {
        // Decompression failed or returned empty
        await AsyncStorage.removeItem(UNSYNCED_SURVEYS_KEY);
        return [];
      }
      return JSON.parse(json);
    } catch (e) {
      // If decompression or parsing fails, clear the corrupted storage and return []
      await AsyncStorage.removeItem(UNSYNCED_SURVEYS_KEY);
      console.error('Failed to get unsynced surveys (corrupted data cleared):', e);
      return [];
    }
  } catch (e) {
    console.error('Failed to get unsynced surveys', e);
    return [];
  }
};

/**
 * Remove a survey from unsyncedSurveys by id (compressed)
 */
export const removeUnsyncedSurvey = async (id: string): Promise<void> => {
  try {
    const all = await getUnsyncedSurveys();
    const filtered = all.filter((s: any) => s.id !== id);
    const compressed = LZString.compressToUTF16(JSON.stringify(filtered));
    await AsyncStorage.setItem(UNSYNCED_SURVEYS_KEY, compressed);
  } catch (e) {
    console.error('Failed to remove unsynced survey', e);
    throw e;
  }
};

/**
 * Get a single survey by id from unsyncedSurveys
 */
export const getLocalSurvey = async (id: string): Promise<any | null> => {
  const all = await getUnsyncedSurveys();
  return all.find((s: any) => s.id === id) || null;
};