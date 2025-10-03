import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkDatabaseHealth, type SurveyImageRow } from './sqlite';
import { cleanupOrphanedImages, getImageStorageStats } from './imageStorage';

/**
 * Image recovery and maintenance utilities for the new storage system
 * Following user requirements: images in device storage, URIs in SQLite
 */

/**
 * Check database health and run image maintenance
 */
export const performImageMaintenance = async (): Promise<{ orphansRemoved: number; dbHealthy: boolean }> => {
  try {
    // Check if database is healthy
    const dbHealthy = await checkDatabaseHealth();
    
    if (dbHealthy) {
      // Clean up orphaned images (files without database records)
      await cleanupOrphanedImages();
      console.log('Image maintenance completed successfully');
    } else {
      console.warn('Database not healthy - skipping image maintenance');
    }
    
    return { orphansRemoved: 0, dbHealthy }; // Actual count would need to be returned from cleanupOrphanedImages
  } catch (error) {
    console.error('Image maintenance failed:', error);
    return { orphansRemoved: 0, dbHealthy: false };
  }
};

/**
 * Get comprehensive storage statistics
 */
export const getStorageStatistics = async (): Promise<{
  totalFiles: number;
  totalSize: number;
  dbHealthy: boolean;
}> => {
  try {
    const stats = await getImageStorageStats();
    const dbHealthy = await checkDatabaseHealth();
    
    return {
      ...stats,
      dbHealthy,
    };
  } catch (error) {
    console.error('Failed to get storage statistics:', error);
    return { totalFiles: 0, totalSize: 0, dbHealthy: false };
  }
};

/**
 * Legacy function - no longer needed with new storage system
 */
export const recoverImagesFromFallback = async (): Promise<{ recovered: number; failed: number }> => {
  console.warn('recoverImagesFromFallback is deprecated - fallback storage no longer used');
  return { recovered: 0, failed: 0 };
};

/**
 * Legacy function - no longer needed with new storage system
 */
export const getFallbackImageCount = async (): Promise<number> => {
  console.warn('getFallbackImageCount is deprecated - fallback storage no longer used');
  return 0;
};

/**
 * Legacy function - no longer needed with new storage system
 */
export const clearFallbackImages = async (): Promise<void> => {
  console.warn('clearFallbackImages is deprecated - fallback storage no longer used');
};