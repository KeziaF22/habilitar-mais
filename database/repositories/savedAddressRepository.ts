import { getDatabase } from '../connection';
import type { SavedAddress } from '@/context/AuthContext';

export async function getSavedAddressesByStudent(studentId: string): Promise<SavedAddress[]> {
  const db = await getDatabase();
  return db.getAllAsync<SavedAddress>(
    'SELECT id, label, street, neighborhood FROM saved_addresses WHERE student_id = ?',
    [studentId]
  );
}

export async function addSavedAddress(address: SavedAddress, studentId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO saved_addresses (id, label, street, neighborhood, student_id) VALUES (?, ?, ?, ?, ?)',
    [address.id, address.label, address.street, address.neighborhood, studentId]
  );
}

export async function removeSavedAddress(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM saved_addresses WHERE id = ?', [id]);
}
