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
 * Simplified version with crash protection
 */
export const storeImageForSurvey = async (
  surveyId: string,
  tempImageUri: string,
  label: string
): Promise<string> => {
  try {
    console.log(`Starting safe image storage: ${label} for survey ${surveyId}`);
    
    // Step 1: Ensure directory exists
    try {
      await ensureSurveyImageDirectory();
    } catch (dirError) {
      console.error('Directory creation failed:', dirError);
      // Continue with temp URI if directory creation fails
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
      // Return temp URI if copy fails
      return tempImageUri;
    }
    
    // Step 4: Store URI in database (non-critical, can fail)
    try {
      await insertSurveyImage({
        surveyId,
        photoUri: permanentUri,
        label,
        timestamp: new Date().toISOString(),
      });
      console.log(`Database record created for: ${permanentUri}`);
    } catch (dbError) {
      console.error('Database storage failed (non-critical):', dbError);
      // Continue with file storage even if database fails
    }
    
    return permanentUri;
    
  } catch (error) {
    console.error(`Image storage failed for ${label}:`, error);
    // Return original URI as fallback
    return tempImageUri;
  }
};

/**
 * Get all images for a survey from SQLite (URIs only)
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
    console.error(`Failed to get images for survey ${surveyId}:`, error);
    return [];
  }
};

/**
 * Delete all images for a survey from both storage and SQLite
 * Called on: survey discontinuation, unsynced survey deletion, successful sync
 */
export const deleteImagesForSurvey = async (surveyId: string): Promise<void> => {
  try {
    console.log(`Starting image cleanup for survey: ${surveyId}`);
    
    // Get all image records from database first
    const imageRecords = await getImagesBySurveyId(surveyId);
    
    // Delete physical files from storage
    const deletePromises = imageRecords.map(async (record) => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(record.photoUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(record.photoUri, { idempotent: true });
          console.log(`Deleted image file: ${record.photoUri}`);
        }
      } catch (fileError) {
        console.error(`Failed to delete image file ${record.photoUri}:`, fileError);
      }
    });
    
    // Wait for all file deletions to complete
    await Promise.allSettled(deletePromises);
    
    // Delete records from SQLite database
    await deleteImagesBySurveyId(surveyId);
    
    console.log(`Image cleanup completed for survey: ${surveyId}`);
    
  } catch (error) {
    console.error(`Failed to delete images for survey ${surveyId}:`, error);
    throw error;
  }
};

/**
 * Clean up orphaned image files (files that exist but have no database record)
 */
export const cleanupOrphanedImages = async (): Promise<void> => {
  try {
    console.log('Starting orphaned image cleanup');
    
    const dirInfo = await FileSystem.getInfoAsync(SURVEY_IMAGES_DIR);
    if (!dirInfo.exists) {
      return;
    }
    
    const files = await FileSystem.readDirectoryAsync(SURVEY_IMAGES_DIR);
    
    for (const filename of files) {
      const filePath = `${SURVEY_IMAGES_DIR}${filename}`;
      
      // Check if this file has a corresponding database record
      // Extract survey ID from filename (format: surveyId_label_timestamp.jpg)
      const parts = filename.split('_');
      if (parts.length >= 2) {
        const surveyId = parts[0];
        const images = await getImagesBySurveyId(surveyId);
        
        // If no database records exist for this survey, delete the file
        if (images.length === 0) {
          try {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            console.log(`Deleted orphaned image: ${filename}`);
          } catch (deleteError) {
            console.error(`Failed to delete orphaned image ${filename}:`, deleteError);
          }
        }
      }
    }
    
    console.log('Orphaned image cleanup completed');
    
  } catch (error) {
    console.error('Failed to cleanup orphaned images:', error);
  }
};

/**
 * Get storage statistics for survey images
 */
export const getImageStorageStats = async (): Promise<{ totalFiles: number; totalSize: number }> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(SURVEY_IMAGES_DIR);
    if (!dirInfo.exists) {
      return { totalFiles: 0, totalSize: 0 };
    }
    
    const files = await FileSystem.readDirectoryAsync(SURVEY_IMAGES_DIR);
    let totalSize = 0;
    
    for (const filename of files) {
      const filePath = `${SURVEY_IMAGES_DIR}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }
    
    return {
      totalFiles: files.length,
      totalSize,
    };
    
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return { totalFiles: 0, totalSize: 0 };
  }
};

// Legacy functions kept for compatibility but updated to use new system
export const insertImagesForSurvey = async (
  surveyId: string,
  photos: { [key: string]: string | null }
) => {
  console.log('Note: insertImagesForSurvey is deprecated. Use storeImageForSurvey instead.');
  
  const labels: (keyof typeof photos)[] = [
    'front',
    'khasra',
    'left',
    'right',
    'other1',
    'other2',
  ] as any;
  
  for (const label of labels) {
    const uri = photos[label as string];
    if (uri) {
      try {
        await storeImageForSurvey(surveyId, uri, String(label));
        console.log(`Image ${label} stored successfully`);
      } catch (e) {
        console.error('insertImagesForSurvey failed for', label, e);
        // Continue with other images even if one fails
      }
    }
  }
};

export const cleanupSurveyImagesBySurveyId = async (surveyId: string): Promise<void> => {
  console.log('Note: cleanupSurveyImagesBySurveyId is deprecated. Use deleteImagesForSurvey instead.');
  await deleteImagesForSurvey(surveyId);
};
