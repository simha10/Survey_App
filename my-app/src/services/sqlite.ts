import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export type SurveyImageRow = {
  id?: number;
  surveyId: string | null;
  photoUri: string;
  label: string;
  timestamp: string;
};

let dbPromise: Promise<SQLiteDatabase> | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;
let isDatabaseCorrupted = false;
let lastErrorTime = 0;
const ERROR_COOLDOWN = 5000;

const resetDatabaseState = () => {
  dbPromise = null;
  initializationPromise = null;
  isInitialized = false;
  console.log('Database state reset');
};

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
      throw error;
    }
  }
  
  throw new Error('Database not available for image URI storage');
};

export const getImagesBySurveyId = async (surveyId: string | null): Promise<SurveyImageRow[]> => {
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        await initializeDatabase();
        
        if (surveyId === null) {
          return await db.getAllAsync(`SELECT * FROM SurveyImages;`);
        }
        
        return await db.getAllAsync(
          `SELECT * FROM SurveyImages WHERE surveyId = ?;`,
          [surveyId]
        );
      }
    } catch (error) {
      console.error('Database query failed:', error);
      isDatabaseCorrupted = true;
      lastErrorTime = Date.now();
    }
  }
  
  return [];
};

export const deleteImagesBySurveyId = async (surveyId: string): Promise<void> => {
  if (shouldAttemptDatabase()) {
    try {
      const db = await getDbAsync();
      if (db) {
        await initializeDatabase();
        
        await db.runAsync(
          `DELETE FROM SurveyImages WHERE surveyId = ?;`,
          [surveyId]
        );
        
        console.log(`Deleted all images for survey ${surveyId}`);
      }
    } catch (error) {
      console.error('Database delete failed:', error);
      isDatabaseCorrupted = true;
      lastErrorTime = Date.now();
      throw error;
    }
  } else {
    throw new Error('Database not available');
  }
};

export const getAllSurveyImages = async (): Promise<SurveyImageRow[]> => {
  return getImagesBySurveyId(null);
};
