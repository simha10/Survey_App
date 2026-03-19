import AsyncStorage from '@react-native-async-storage/async-storage';

const UNSAVED_DRAFT_KEY = '@ptms_unsaved_survey_draft';
const SURVEY_STATUS_KEY = '@ptms_survey_status';

export interface UnsavedDraft {
  surveyId: string;
  surveyType: 'Residential' | 'Non-Residential' | 'Mixed';
  editMode: boolean;
  assignment: any;
  masterData: any;
  formData: any; // Complete form field values
  photos: { [key: string]: string | null }; // Photo URIs
  timestamp: number;
  lastAction: 'form_updated' | 'photo_added' | 'navigation_exit';
}

export interface SurveyStatus {
  surveyId: string;
  isSaved: boolean;
  lastSavedAt?: number;
  createdAt: number;
}

/**
 * Save unsurvey draft for recovery
 */
export const saveUnsavedDraft = async (draft: UnsavedDraft): Promise<void> => {
  try {
    console.log('[DraftStorage] Attempting to save draft:', draft.surveyId);
    console.log('[DraftStorage] Draft data:', JSON.stringify(draft, null, 2));
    
    // Validate draft has minimum required fields
    if (!draft.surveyId) {
      console.error('[DraftStorage] Cannot save draft - missing surveyId');
      return;
    }
    
    // Check if draft has at least some data (form OR photos)
    const hasFormData = draft.formData && Object.keys(draft.formData).length > 0;
    const hasPhotos = draft.photos && typeof draft.photos === 'object';
    
    console.log('[DraftStorage] Has form data:', hasFormData);
    console.log('[DraftStorage] Has photos object:', hasPhotos);
    
    if (!hasFormData && !hasPhotos) {
      console.warn('[DraftStorage] Saving draft with minimal data - this is OK if user just started survey');
    }
    
    // Serialize and validate
    const serialized = JSON.stringify(draft);
    console.log('[DraftStorage] Serialized draft size:', serialized.length, 'bytes');
    
    if (serialized.length < 10) {
      console.error('[DraftStorage] WARNING: Draft serialization produced very small output');
    }
    
    await AsyncStorage.setItem(UNSAVED_DRAFT_KEY, serialized);
    console.log('[DraftStorage] ✅ Saved unsaved draft successfully:', draft.surveyId);
  } catch (error) {
    console.error('[DraftStorage] ❌ Failed to save unsaved draft:', error);
    console.error('[DraftStorage] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('[DraftStorage] Draft that failed:', JSON.stringify(draft));
  }
};

/**
 * Get unsaved draft
 */
export const getUnsavedDraft = async (): Promise<UnsavedDraft | null> => {
  try {
    const saved = await AsyncStorage.getItem(UNSAVED_DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved) as UnsavedDraft;
      
      // Validate expiry (30 minutes)
      const age = Date.now() - draft.timestamp;
      const MAX_AGE = 30 * 60 * 1000;
      
      if (age > MAX_AGE) {
        console.log('[DraftStorage] Draft expired, clearing');
        await clearUnsavedDraft();
        return null;
      }
      
      return draft;
    }
    return null;
  } catch (error) {
    console.error('[DraftStorage] Failed to get unsaved draft:', error);
    return null;
  }
};

/**
 * Clear unsaved draft (called after successful save or user cancel)
 */
export const clearUnsavedDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(UNSAVED_DRAFT_KEY);
    console.log('[DraftStorage] Cleared unsaved draft');
  } catch (error) {
    console.error('[DraftStorage] Failed to clear unsaved draft:', error);
  }
};

/**
 * Update survey status (saved vs unsaved)
 */
export const updateSurveyStatus = async (
  surveyId: string,
  isSaved: boolean
): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(SURVEY_STATUS_KEY);
    const status: SurveyStatus = existing ? JSON.parse(existing) : {
      surveyId,
      isSaved,
      createdAt: Date.now(),
    };
    
    status.isSaved = isSaved;
    if (isSaved) {
      status.lastSavedAt = Date.now();
    }
    
    await AsyncStorage.setItem(SURVEY_STATUS_KEY, JSON.stringify(status));
    console.log('[SurveyStatus] Updated status:', surveyId, isSaved);
  } catch (error) {
    console.error('[SurveyStatus] Failed to update status:', error);
  }
};

/**
 * Check if survey is saved
 */
export const isSurveySaved = async (surveyId: string): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(SURVEY_STATUS_KEY);
    if (status) {
      const parsed = JSON.parse(status) as SurveyStatus;
      return parsed.surveyId === surveyId && parsed.isSaved === true;
    }
    return false;
  } catch (error) {
    console.error('[SurveyStatus] Failed to check status:', error);
    return false;
  }
};

/**
 * Clear survey status
 */
export const clearSurveyStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SURVEY_STATUS_KEY);
    console.log('[SurveyStatus] Cleared status');
  } catch (error) {
    console.error('[SurveyStatus] Failed to clear status:', error);
  }
};

/**
 * Check if draft exists and is recent
 */
export const hasRecentDraft = async (): Promise<boolean> => {
  const draft = await getUnsavedDraft();
  return draft !== null;
};
