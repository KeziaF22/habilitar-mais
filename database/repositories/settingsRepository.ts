import { getDatabase } from '../connection';

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string | null }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return row ? row.value : null;
}

export async function setSetting(key: string, value: string | null): Promise<void> {
  const db = await getDatabase();
  if (value === null) {
    await db.runAsync('DELETE FROM settings WHERE key = ?', [key]);
  } else {
    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }
}
