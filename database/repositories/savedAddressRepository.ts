import { getDatabase } from '../connection';
import type { SavedAddress } from '@/context/AuthContext';

export async function getAllSavedAddresses(): Promise<SavedAddress[]> {
  const db = await getDatabase();
  return db.getAllAsync<SavedAddress>('SELECT * FROM saved_addresses');
}

export async function addSavedAddress(address: SavedAddress): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO saved_addresses (id, label, street, neighborhood) VALUES (?, ?, ?, ?)',
    [address.id, address.label, address.street, address.neighborhood]
  );
}

export async function removeSavedAddress(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM saved_addresses WHERE id = ?', [id]);
}
