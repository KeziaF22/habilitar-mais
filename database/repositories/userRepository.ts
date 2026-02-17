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

export async function getUserByCpf(cpf: string): Promise<UserRow | null> {
  const db = await getDatabase();
  // Check CPF in students table
  const student = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM students WHERE cpf = ?',
    [cpf]
  );
  if (student) {
    return db.getFirstAsync<UserRow>(
      'SELECT * FROM users WHERE student_id = ?',
      [student.id]
    );
  }
  // Check CPF in users table directly (for instructors stored with cpf)
  const userWithCpf = await db.getFirstAsync<UserRow>(
    'SELECT u.* FROM users u JOIN instructors i ON u.instructor_id = i.id WHERE i.cpf = ?',
    [cpf]
  );
  return userWithCpf || null;
}

export async function updateUserPassword(email: string, newPasswordHash: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE users SET password_hash = ? WHERE email = ?',
    [newPasswordHash, email]
  );
  return result.changes > 0;
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
