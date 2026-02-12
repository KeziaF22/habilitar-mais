import { getDatabase } from '../connection';
import type { Instructor } from '@/context/AuthContext';

function rowToInstructor(row: any): Instructor {
  return {
    id: row.id,
    name: row.name,
    car: row.car,
    carImage: row.carImage,
    rating: row.rating,
    pricePerHour: row.pricePerHour,
    transmission: row.transmission,
    bio: row.bio,
    reviews: JSON.parse(row.reviews),
    availability: JSON.parse(row.availability),
    profileImage: row.profileImage,
    coverImage: row.coverImage,
    specialties: JSON.parse(row.specialties),
    isAvailable: Boolean(row.isAvailable),
    location: row.location,
    coordinates: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
  };
}

export async function getAllInstructors(): Promise<Instructor[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync('SELECT * FROM instructors');
  return rows.map(rowToInstructor);
}

export async function getInstructorById(id: string): Promise<Instructor | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM instructors WHERE id = ?', [id]);
  return row ? rowToInstructor(row) : null;
}

export async function addInstructor(instructor: Instructor): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO instructors (id, name, car, carImage, rating, pricePerHour,
     transmission, bio, reviews, availability, profileImage, coverImage,
     specialties, isAvailable, location, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      instructor.id,
      instructor.name,
      instructor.car,
      instructor.carImage,
      instructor.rating,
      instructor.pricePerHour,
      instructor.transmission,
      instructor.bio,
      JSON.stringify(instructor.reviews),
      JSON.stringify(instructor.availability),
      instructor.profileImage,
      instructor.coverImage,
      JSON.stringify(instructor.specialties),
      instructor.isAvailable ? 1 : 0,
      instructor.location,
      instructor.coordinates.latitude,
      instructor.coordinates.longitude,
    ]
  );
}

export async function updateInstructor(
  id: string,
  updates: Partial<Instructor>
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.car !== undefined) { fields.push('car = ?'); values.push(updates.car); }
  if (updates.bio !== undefined) { fields.push('bio = ?'); values.push(updates.bio); }
  if (updates.transmission !== undefined) { fields.push('transmission = ?'); values.push(updates.transmission); }
  if (updates.pricePerHour !== undefined) { fields.push('pricePerHour = ?'); values.push(updates.pricePerHour); }
  if (updates.profileImage !== undefined) { fields.push('profileImage = ?'); values.push(updates.profileImage); }
  if (updates.location !== undefined) { fields.push('location = ?'); values.push(updates.location); }
  if (updates.isAvailable !== undefined) { fields.push('isAvailable = ?'); values.push(updates.isAvailable ? 1 : 0); }

  if (fields.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE instructors SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}
