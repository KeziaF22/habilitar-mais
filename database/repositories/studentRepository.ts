import { getDatabase } from '../connection';
import type { Student } from '@/context/AuthContext';

export async function getAllStudents(): Promise<Student[]> {
  const db = await getDatabase();
  return db.getAllAsync<Student>('SELECT * FROM students');
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Student>('SELECT * FROM students WHERE id = ?', [id]);
}

export async function addStudent(student: Student): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO students (id, name, email, phone) VALUES (?, ?, ?, ?)',
    [student.id, student.name, student.email ?? null, student.phone ?? null]
  );
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push('email = ?');
    values.push(updates.email);
  }
  if (updates.phone !== undefined) {
    fields.push('phone = ?');
    values.push(updates.phone);
  }

  if (fields.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE students SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}
