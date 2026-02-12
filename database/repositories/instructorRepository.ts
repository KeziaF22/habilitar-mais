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
