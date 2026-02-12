import { SQLiteDatabase } from 'expo-sqlite';

const DB_VERSION = 1;

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS instructors (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  car TEXT NOT NULL,
  carImage TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 0,
  pricePerHour REAL NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Auto')),
  bio TEXT NOT NULL DEFAULT '',
  reviews TEXT NOT NULL DEFAULT '[]',
  availability TEXT NOT NULL DEFAULT '[]',
  profileImage TEXT NOT NULL DEFAULT '',
  coverImage TEXT NOT NULL DEFAULT '',
  specialties TEXT NOT NULL DEFAULT '[]',
  isAvailable INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL DEFAULT '',
  latitude REAL NOT NULL DEFAULT 0,
  longitude REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY NOT NULL,
  studentId TEXT NOT NULL,
  instructorId TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aceita', 'Recusada')),
  price REAL NOT NULL,
  address TEXT,
  paymentMethod TEXT,
  serviceFee REAL,
  discount REAL,
  totalPrice REAL,
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (instructorId) REFERENCES instructors(id)
);

CREATE TABLE IF NOT EXISTS saved_addresses (
  id TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL,
  street TEXT NOT NULL,
  neighborhood TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  studentId TEXT NOT NULL,
  instructorId TEXT NOT NULL,
  PRIMARY KEY (studentId, instructorId),
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (instructorId) REFERENCES instructors(id)
);

CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT
);

CREATE TABLE IF NOT EXISTS db_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT
);
`;

export async function initializeSchema(db: SQLiteDatabase): Promise<void> {
  // Create db_meta first to check version
  await db.execAsync('CREATE TABLE IF NOT EXISTS db_meta (key TEXT PRIMARY KEY NOT NULL, value TEXT);');

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM db_meta WHERE key = ?',
    ['version']
  );
  const currentVersion = row ? parseInt(row.value, 10) : 0;

  if (currentVersion < DB_VERSION) {
    await db.execAsync(CREATE_TABLES);
    await db.runAsync(
      'INSERT OR REPLACE INTO db_meta (key, value) VALUES (?, ?)',
      ['version', String(DB_VERSION)]
    );
  }
}
