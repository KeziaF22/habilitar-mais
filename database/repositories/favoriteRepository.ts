import { getDatabase } from '../connection';

export async function getFavoriteInstructorIds(studentId: string): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ instructorId: string }>(
    'SELECT instructorId FROM favorites WHERE studentId = ?',
    [studentId]
  );
  return rows.map((row) => row.instructorId);
}

export async function toggleFavorite(
  studentId: string,
  instructorId: string
): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync(
    'SELECT 1 FROM favorites WHERE studentId = ? AND instructorId = ?',
    [studentId, instructorId]
  );

  if (existing) {
    await db.runAsync(
      'DELETE FROM favorites WHERE studentId = ? AND instructorId = ?',
      [studentId, instructorId]
    );
    return false;
  } else {
    await db.runAsync(
      'INSERT INTO favorites (studentId, instructorId) VALUES (?, ?)',
      [studentId, instructorId]
    );
    return true;
  }
}
