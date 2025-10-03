import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export type SurveyImageRow = {
  id?: number;
  surveyId: string | null;
  photoUri: string;
  label: string; // e.g., 'khasra' | 'front' | 'left' | 'right' | 'other1' | 'other2'
  timestamp: string; // ISO string
};

let dbPromise: Promise<SQLiteDatabase> | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;
let isDatabaseCorrupted = false;
let lastErrorTime = 0;
const ERROR_COOLDOWN = 5000; // 5 seconds between error attempts

// Reset database state completely
const resetDatabaseState = () => {
  dbPromise = null;
  initializationPromise = null;
  isInitialized = false;
  console.log('Database state reset');
};

// Check if we should attempt database operations
const shouldAttemptDatabase = (): boolean => {
  const now = Date.now();
  if (isDatabaseCorrupted && (now - lastErrorTime) < ERROR_COOLDOWN) {
    return false;
  }
  return true;
};

export const getDbAsync = async (): Promise<SQLiteDatabase | null> => {
  if (!shouldAttemptDatabase()) {
    console.log('Database corrupted, skipping operation');
    return null;
  }

  try {
    if (!dbPromise) {
      console.log('Opening new database connection...');
      dbPromise = openDatabaseAsync('app.db');
    }
    
    const db = await dbPromise;
    
    // Simple test to ensure database is working
    await db.getAllAsync('SELECT 1;');
    
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    isDatabaseCorrupted = true;
    lastErrorTime = Date.now();
    resetDatabaseState();
    return null;
  }
};

export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized || !shouldAttemptDatabase()) {
    return;
  }
  
  if (initializationPromise) {
    return initializationPromise;
  }
  
  initializationPromise = (async () => {
    try {
      const db = await getDbAsync();
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      console.log('Creating SurveyImages table...');
      
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS SurveyImages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          surveyId TEXT,
          photoUri TEXT NOT NULL,
          label TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );`
      );
      
      console.log('Creating index...');
      await db.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_survey_images_surveyId ON SurveyImages(surveyId);`
      );
      
      console.log('Testing table access...');
      await db.getAllAsync('SELECT COUNT(*) as count FROM SurveyImages;');
      
      isInitialized = true;
      isDatabaseCorrupted = false;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      isInitialized = false;
      initializationPromise = null;
      isDatabaseCorrupted = true;
      lastErrorTime = Date.now();
      throw error;
    }
  })();
  
  return initializationPromise;
};

export const insertSurveyImage = async (row: SurveyImageRow): Promise<number> => {
  // Try database first - no fallback storage as per new requirements
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        await initializeDatabase();
        
        const res: any = await db.runAsync(
          `INSERT INTO SurveyImages (surveyId, photoUri, label, timestamp) VALUES (?, ?, ?, ?);`,
          [row.surveyId, row.photoUri, row.label, row.timestamp]
        );
        
        const insertId = res?.lastInsertRowId || 0;
        console.log('Image URI stored in database with ID:', insertId);
        return insertId;
      }
    } catch (error) {
      console.error('Database insert failed:', error);
      isDatabaseCorrupted = true;
      lastErrorTime = Date.now();
      throw error; // Re-throw to indicate failure
    }
  }
  
  throw new Error('Database not available for image URI storage');
};

export const getImagesBySurveyId = async (surveyId: string | null): Promise<SurveyImageRow[]> => {
  // Only use database - no fallback storage as per requirements
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        await initializeDatabase();
        
        if (surveyId === null) {
          return await db.getAllAsync<SurveyImageRow>(
            `SELECT id, surveyId, photoUri, label, timestamp FROM SurveyImages WHERE surveyId IS NULL ORDER BY timestamp DESC;`
          );
        } else {
          return await db.getAllAsync<SurveyImageRow>(
            `SELECT id, surveyId, photoUri, label, timestamp FROM SurveyImages WHERE surveyId = ? ORDER BY timestamp DESC;`,
            [surveyId]
          );
        }
      }
    } catch (error) {
      console.error('Database query failed:', error);
      isDatabaseCorrupted = true;
      lastErrorTime = Date.now();
    }
  }
  
  console.warn('Database not available, returning empty image list');
  return [];
};

export const deleteImageById = async (id: number): Promise<void> => {
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        await db.runAsync(`DELETE FROM SurveyImages WHERE id = ?;`, [id]);
        console.log('Image record deleted from database:', id);
        return;
      }
    } catch (error) {
      console.error('Failed to delete image by ID:', error);
    }
  }
  
  console.warn('Database not available for image deletion');
};

export const deleteImagesBySurveyId = async (surveyId: string | null): Promise<void> => {
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        if (surveyId === null) {
          await db.runAsync(`DELETE FROM SurveyImages WHERE surveyId IS NULL;`);
        } else {
          await db.runAsync(`DELETE FROM SurveyImages WHERE surveyId = ?;`, [surveyId]);
        }
        console.log('Image records deleted from database for survey:', surveyId);
        return;
      }
    } catch (error) {
      console.error('Failed to delete images by survey ID:', error);
    }
  }
  
  console.warn('Database not available for image deletion');
};

// Health check function to verify database state
export const checkDatabaseHealth = async (): Promise<boolean> => {
  if (!shouldAttemptDatabase()) {
    return false;
  }
  
  try {
    const db = await getDbAsync();
    if (!db) return false;
    
    // Try to perform a simple query to check if table exists
    const result = await db.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='SurveyImages';`
    );
    
    const tableExists = result.length > 0;
    
    if (!tableExists) {
      console.warn('SurveyImages table does not exist, reinitializing...');
      isInitialized = false;
      initializationPromise = null;
      await initializeDatabase();
    }
    
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    isDatabaseCorrupted = true;
    lastErrorTime = Date.now();
    return false;
  }
};

// Initialize on import to ensure table exists
initializeDatabase().catch((e) => {
  console.error('SQLite init failed on import:', e);
  isDatabaseCorrupted = true;
  lastErrorTime = Date.now();
});