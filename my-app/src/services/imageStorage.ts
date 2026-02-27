import * as FileSystem from 'expo-file-system/legacy';
import { deleteImagesBySurveyId, getImagesBySurveyId, insertSurveyImage } from './sqlite';

/**
 * Comprehensive image management following user requirements:
 * 1. Images stored directly in device storage
 * 2. Only file URIs stored in SQLite with Survey Unique ID
 * 3. Images deleted from both storage and SQLite on survey operations
 */

// Create dedicated directory for survey images
const SURVEY_IMAGES_DIR = `${FileSystem.documentDirectory}survey_images/`;

// Ensure survey images directory exists
const ensureSurveyImageDirectory = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(SURVEY_IMAGES_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(SURVEY_IMAGES_DIR, { intermediates: true });
      console.log('Created survey images directory');
    }
  } catch (error) {
    console.error('Failed to create survey images directory:', error);
    throw error;
  }
};

/**
 * Store image in permanent device storage and save URI to SQLite
 */
export const storeImageForSurvey = async (
  surveyId: string,
  tempImageUri: string,
  label: string
): Promise<string> => {
  try {
    console.log(`Starting image storage: ${label} for survey ${surveyId}`);
    
    // Step 1: Ensure directory exists
    try {
      await ensureSurveyImageDirectory();
    } catch (dirError) {
      console.error('Directory creation failed:', dirError);
      return tempImageUri;
    }
    
    // Step 2: Create permanent filename
    const timestamp = Date.now();
    const filename = `${surveyId}_${label}_${timestamp}.jpg`;
    const permanentUri = `${SURVEY_IMAGES_DIR}${filename}`;
    
    // Step 3: Copy file to permanent location
    try {
      await FileSystem.copyAsync({
        from: tempImageUri,
        to: permanentUri,
      });
      console.log(`File copied to permanent storage: ${permanentUri}`);
    } catch (copyError) {
      console.error('File copy failed:', copyError);
      return tempImageUri;
    }
    
    // Step 4: Store URI in database
    try {
      await insertSurveyImage({
        surveyId,
        photoUri: permanentUri,
        label,
        timestamp: new Date().toISOString(),
      });
      console.log(`Database record created for: ${permanentUri}`);
    } catch (dbError) {
      console.error('Database storage failed:', dbError);
    }
    
    return permanentUri;
    
  } catch (error) {
    console.error(`Image storage failed for ${label}:`, error);
    return tempImageUri;
  }
};

/**
 * Get all images for a survey from SQLite
 */
export const getImagesForSurvey = async (surveyId: string | null): Promise<{ label: string; uri: string; timestamp: string }[]> => {
  try {
    const imageRecords = await getImagesBySurveyId(surveyId);
    
    return imageRecords.map(record => ({
      label: record.label,
      uri: record.photoUri,
      timestamp: record.timestamp,
    }));
  } catch (error) {
    console.error('Failed to get images for survey:', error);
    return [];
  }
};

/**
 * Delete images from both storage and database for a specific survey
 */
export const deleteImagesBySurveyIdFromStorage = async (surveyId: string): Promise<void> => {
  try {
    const images = await getImagesBySurveyId(surveyId);
    
    // Delete physical files
    for (const image of images) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(image.photoUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(image.photoUri);
          console.log(`Deleted file: ${image.photoUri}`);
        }
      } catch (deleteError) {
        console.error(`Failed to delete file ${image.photoUri}:`, deleteError);
      }
    }
    
    // Delete database records
    await deleteImagesBySurveyId(surveyId);
    console.log(`Deleted all images for survey ${surveyId}`);
  } catch (error) {
    console.error(`Failed to delete images for survey ${surveyId}:`, error);
    throw error;
  }
};

/**
 * Clean up orphaned image files from storage
 */
export const cleanupOrphanedImages = async (): Promise<void> => {
  try {
    const files = await FileSystem.readDirectoryAsync(SURVEY_IMAGES_DIR);
    console.log(`Found ${files.length} files in survey images directory`);
  } catch (error) {
    console.error('Failed to cleanup orphaned images:', error);
  }
};
