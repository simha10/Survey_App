import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export type SurveyImageRow = {
  id?: number;
  surveyId: string | null;
  photoUri: string;
  label: string; // e.g., 'khasra' | 'front' | 'left' | 'right' | 'other1' | 'other2'
  timestamp: string; // ISO string
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

export const getDbAsync = async (): Promise<SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync('app.db');
  }
  return dbPromise;
};

export const initializeDatabase = async (): Promise<void> => {
  const db = await getDbAsync();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS SurveyImages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surveyId TEXT,
      photoUri TEXT NOT NULL,
      label TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );`
  );
  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_survey_images_surveyId ON SurveyImages(surveyId);`
  );
};

export const insertSurveyImage = async (row: SurveyImageRow): Promise<number> => {
  const db = await getDbAsync();
  const res: any = await db.runAsync(
    `INSERT INTO SurveyImages (surveyId, photoUri, label, timestamp) VALUES (?, ?, ?, ?);`,
    row.surveyId,
    row.photoUri,
    row.label,
    row.timestamp
  );
  return (res?.lastInsertRowId as number) ?? 0;
};

export const getImagesBySurveyId = async (surveyId: string | null): Promise<SurveyImageRow[]> => {
  const db = await getDbAsync();
  if (surveyId === null) {
    const rows = (await db.getAllAsync<SurveyImageRow>(
      `SELECT id, surveyId, photoUri, label, timestamp FROM SurveyImages WHERE surveyId IS NULL ORDER BY timestamp DESC;`
    )) as SurveyImageRow[];
    return rows;
  }
  const rows = (await db.getAllAsync<SurveyImageRow>(
    `SELECT id, surveyId, photoUri, label, timestamp FROM SurveyImages WHERE surveyId = ? ORDER BY timestamp DESC;`,
    surveyId
  )) as SurveyImageRow[];
  return rows;
};

export const deleteImageById = async (id: number): Promise<void> => {
  const db = await getDbAsync();
  await db.runAsync(`DELETE FROM SurveyImages WHERE id = ?;`, id);
};

export const deleteImagesBySurveyId = async (surveyId: string | null): Promise<void> => {
  const db = await getDbAsync();
  if (surveyId === null) {
    await db.runAsync(`DELETE FROM SurveyImages WHERE surveyId IS NULL;`);
    return;
  }
  await db.runAsync(`DELETE FROM SurveyImages WHERE surveyId = ?;`, surveyId);
};

// Initialize on import to ensure table exists
initializeDatabase().catch((e) => console.error('SQLite init failed', e));
