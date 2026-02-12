import { getDatabase } from '../connection';

export async function getAllLocations(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ name: string }>('SELECT name FROM locations');
  return rows.map((row) => row.name);
}
