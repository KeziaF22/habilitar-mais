import { getDatabase } from '../connection';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: 'student' | 'instructor' | null;
  student_id: string | null;
  instructor_id: string | null;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const db = await getDatabase();
  return db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const db = await getDatabase();
  return db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
}

export async function createUser(user: {
  id: string;
  email: string;
  password_hash: string;
  role: string | null;
  student_id: string | null;
  instructor_id: string | null;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO users (id, email, password_hash, role, student_id, instructor_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user.id, user.email, user.password_hash, user.role, user.student_id, user.instructor_id]
  );
}

export async function updateUserRole(
  userId: string,
  role: 'student' | 'instructor',
  linkedId: string
): Promise<void> {
  const db = await getDatabase();
  if (role === 'student') {
    await db.runAsync(
      'UPDATE users SET role = ?, student_id = ? WHERE id = ?',
      [role, linkedId, userId]
    );
  } else {
    await db.runAsync(
      'UPDATE users SET role = ?, instructor_id = ? WHERE id = ?',
      [role, linkedId, userId]
    );
  }
}
