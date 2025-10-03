import * as FileSystem from 'expo-file-system';
import { File } from 'expo-file-system';
import { deleteImagesBySurveyId, getImagesBySurveyId, insertSurveyImage } from './sqlite';

export const cleanupSurveyImagesBySurveyId = async (surveyId: string): Promise<void> => {
  try {
    const rows = await getImagesBySurveyId(surveyId);
    for (const row of rows) {
      if (row.photoUri) {
        try {
          const file = new File(row.photoUri);
          file.delete();
        } catch (e) {
          // best-effort cleanup
          console.error('Failed deleting file', row.photoUri, e);
        }
      }
    }
    await deleteImagesBySurveyId(surveyId);
  } catch (e) {
    console.error('cleanupSurveyImagesBySurveyId failed', e);
  }
};

export const insertImagesForSurvey = async (surveyId: string, photos: { [key: string]: string | null }) => {
  const labels: (keyof typeof photos)[] = ['front', 'khasra', 'left', 'right', 'other1', 'other2'] as any;
  for (const label of labels) {
    const uri = photos[label as string];
    if (uri) {
      try {
        // Ensure database is initialized before inserting
        const { initializeDatabase } = await import('./sqlite');
        await initializeDatabase();
        
        await insertSurveyImage({
          surveyId,
          photoUri: uri,
          label: String(label),
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error('insertImagesForSurvey failed for', label, e);
      }
    }
  }
};

export const copyPhotosToDocumentDir = async (surveyId: string, photos: { [key: string]: string | null }) => {
  const out: { [key: string]: string | null } = { ...photos };
  const labels: (keyof typeof photos)[] = ['front', 'khasra', 'left', 'right', 'other1', 'other2'] as any;
  for (const label of labels) {
    const uri = photos[label as string];
    if (!uri) continue;
    const fileName = `survey_${surveyId}_${String(label)}_${Date.now()}.jpg`;
    const destUri = `${FileSystem.Paths.document.uri}${fileName}`;
    try {
      const sourceFile = new File(uri);
      const destFile = new File(destUri);
      sourceFile.copy(destFile);
      out[label as string] = destFile.exists ? destUri : uri;
    } catch (e) {
      console.error('copyPhotosToDocumentDir failed', label, e);
      out[label as string] = uri;
    }
  }
  return out;
};


