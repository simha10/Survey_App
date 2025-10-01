import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import LZString from 'lz-string';
import api from '../api/axiosConfig';
import { cleanupSurveyImagesBySurveyId } from '../services/imageStorage';

const UNSYNCED_SURVEYS_KEY = 'unsyncedSurveys';
const MASTER_DATA_KEY = 'masterData';
const USER_ASSIGNMENTS_KEY = 'userAssignments';
const SELECTED_ASSIGNMENT_KEY = 'selectedAssignment';
const SYNCED_SURVEYS_LOG_KEY = '@syncedSurveysLog';

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
    let json = LZString.decompressFromUTF16(compressed);
    if (json && typeof json === 'string' && json.trim() !== '') {
      return JSON.parse(json);
    }
    // Fallback: handle legacy uncompressed JSON stored previously
    try {
      const legacy = JSON.parse(compressed);
      // Normalize by re-saving in compressed format for future reads
      await saveMasterData(legacy);
      return legacy;
    } catch (_) {
      return null;
    }
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
  // Read userId from 'user' (primary) or 'userInfo' (fallback)
  // Ensure user object has both id and userId
  await migrateUserObject();
  let userRaw = await AsyncStorage.getItem('user');
  if (!userRaw) userRaw = await AsyncStorage.getItem('userInfo');
  const parsedUser = userRaw ? JSON.parse(userRaw) : null;
  let userId = parsedUser ? (parsedUser.id || parsedUser.userId) : null;
  // If userId is still null, try to fetch from backend and update AsyncStorage
  if (!userId && token) {
    try {
      const res = await api.get('/user/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.id) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
        userId = res.data.id;
        console.log('Fetched user profile from backend and updated AsyncStorage:', res.data);
      }
    } catch (e) {
      console.error('Failed to fetch user profile for userId recovery', e);
    }
  }
  for (const survey of unsynced) {
    try {
      // Deep clone the survey data to avoid mutating local storage
      const payload = JSON.parse(JSON.stringify(survey.data));
      // If Non-Residential, remove propertyTypeId from locationDetails
      if (survey.surveyType === 'Non-Residential' && payload.locationDetails) {
        delete payload.locationDetails.propertyTypeId;
      }
      const res = await api.post('/surveys/addSurvey', payload);
      if (res.status === 200 || res.status === 201) {
        await removeUnsyncedSurvey(survey.id);
        if (userId) {
          console.log('Logging synced survey:', survey.id, userId);
          await logSyncedSurvey(survey.id, userId);
          const logRaw = await AsyncStorage.getItem(SYNCED_SURVEYS_LOG_KEY);
          console.log('Log after syncing:', logRaw);
        } else {
          console.log('UserId is null, not logging synced survey:', survey.id);
        }
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
    // Cleanup any persisted images for this survey (files + SQLite rows)
    try { await cleanupSurveyImagesBySurveyId(id); } catch (e) { console.error('Image cleanup failed for', id, e); }
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

/**
 * Update a survey in unsyncedSurveys by id
 */
export const updateLocalSurvey = async (id: string, updatedSurvey: any): Promise<void> => {
  try {
    const all = await getUnsyncedSurveys();
    const updated = all.map((s: any) => s.id === id ? updatedSurvey : s);
    const compressed = LZString.compressToUTF16(JSON.stringify(updated));
    await AsyncStorage.setItem(UNSYNCED_SURVEYS_KEY, compressed);
  } catch (e) {
    console.error('Failed to update local survey', e);
    throw e;
  }
};

export const logSyncedSurvey = async (surveyId: string, userId: string) => {
  try {
    const now = new Date().toISOString();
    const logRaw = await AsyncStorage.getItem(SYNCED_SURVEYS_LOG_KEY);
    let log: any[] = logRaw ? JSON.parse(logRaw) : [];
    if (!log.some(entry => entry.id === surveyId && entry.userId === userId)) {
      const entry = { id: surveyId, userId, syncedAt: now };
      log.push(entry);
      console.log('Adding log entry:', entry);
      await AsyncStorage.setItem(SYNCED_SURVEYS_LOG_KEY, JSON.stringify(log));
    } else {
      console.log('Log entry already exists for:', surveyId, userId);
    }
  } catch (e) {
    console.error('Failed to log synced survey', e);
  }
};

/**
 * Migrate user object in AsyncStorage to ensure both 'id' and 'userId' fields are present
 */
export const migrateUserObject = async () => {
  try {
    const userRaw = await AsyncStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (!user.id || !user.userId || user.id !== user.userId) {
        const id = user.userId || user.id;
        const normalizedUser = { ...user, id, userId: id };
        await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
        console.log('Migrated user object in AsyncStorage:', normalizedUser);
      }
    }
  } catch (e) {
    console.error('Failed to migrate user object in AsyncStorage', e);
  }
};