import { SQLiteDatabase } from 'expo-sqlite';
import { simpleHash } from '@/utils/hash';

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const count = await db.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM instructors'
  );
  if (count && count.cnt > 0) return;

  await db.withTransactionAsync(async () => {
    // --- Instructors ---
    await db.runAsync(
      `INSERT INTO instructors (id, name, car, carImage, rating, pricePerHour, transmission, bio, reviews, availability, profileImage, coverImage, specialties, isAvailable, location, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'inst1',
        'Carlos Santos',
        'Honda City',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop',
        4.8,
        80.0,
        'Auto',
        'Instrutor experiente com foco em direção defensiva e segurança.',
        JSON.stringify([
          { student: 'João Paulo', comment: 'Ótimo instrutor! Muito paciente.', rating: 5 },
          { student: 'Maria Silva', comment: 'Me ajudou muito a perder o medo.', rating: 4 },
        ]),
        JSON.stringify([
          { day: 'Seg', time: '09:00' },
          { day: 'Seg', time: '10:00' },
          { day: 'Ter', time: '14:00' },
          { day: 'Ter', time: '15:00' },
        ]),
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=300&fit=crop',
        JSON.stringify(['Direção Defensiva', 'Estacionamento', 'Baliza']),
        1,
        'Jardins',
        -3.1150,
        -60.0250,
      ]
    );

    await db.runAsync(
      `INSERT INTO instructors (id, name, car, carImage, rating, pricePerHour, transmission, bio, reviews, availability, profileImage, coverImage, specialties, isAvailable, location, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'inst2',
        'Ana Costa',
        'Hyundai HB20',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
        4.9,
        75.0,
        'Manual',
        'Especialista em baliza e direção em trânsito intenso. Habilitada para ensinar.',
        JSON.stringify([
          { student: 'Pedro Lima', comment: 'A Ana é super didática, recomendo!', rating: 5 },
          { student: 'Bruna Alves', comment: 'Pontual e muito atenciosa.', rating: 5 },
        ]),
        JSON.stringify([
          { day: 'Qua', time: '08:00' },
          { day: 'Qua', time: '09:00' },
          { day: 'Qui', time: '16:00' },
          { day: 'Qui', time: '17:00' },
        ]),
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=300&fit=crop',
        JSON.stringify(['Baliza', 'Trânsito Intenso', 'Câmbio Manual', 'Direção Urbana']),
        0,
        'Centro',
        -3.1300,
        -60.0200,
      ]
    );

    await db.runAsync(
      `INSERT INTO instructors (id, name, car, carImage, rating, pricePerHour, transmission, bio, reviews, availability, profileImage, coverImage, specialties, isAvailable, location, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'inst3',
        'Marcos Oliveira',
        'Chevrolet Onix',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop',
        4.7,
        85.0,
        'Auto',
        'Foco na praticidade e confiança do aluno ao volante.',
        JSON.stringify([
          { student: 'Julia Mendes', comment: 'O Marcos me deu muita segurança.', rating: 4 },
          { student: 'Lucas Pereira', comment: 'Boa experiência de aprendizado.', rating: 5 },
        ]),
        JSON.stringify([
          { day: 'Sex', time: '10:00' },
          { day: 'Sex', time: '11:00' },
          { day: 'Sab', time: '08:00' },
          { day: 'Sab', time: '09:00' },
        ]),
        'https://randomuser.me/api/portraits/men/75.jpg',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop',
        JSON.stringify(['Primeira Habilitação', 'Confiança ao Volante', 'Rodovias']),
        1,
        'Ponta Negra',
        -3.0800,
        -60.1100,
      ]
    );

    // --- Students ---
    await db.runAsync(
      'INSERT INTO students (id, name, email, phone) VALUES (?, ?, ?, ?)',
      ['stud1', 'João Paulo', 'joao@email.com', '(92) 99999-9999']
    );
    await db.runAsync(
      'INSERT INTO students (id, name, email, phone) VALUES (?, ?, ?, ?)',
      ['stud2', 'Maria Silva', 'maria@email.com', '(92) 98888-8888']
    );
    await db.runAsync(
      'INSERT INTO students (id, name, email, phone) VALUES (?, ?, ?, ?)',
      ['stud3', 'Pedro Lima', 'pedro@email.com', '(92) 97777-7777']
    );

    // --- Saved Addresses ---
    await db.runAsync(
      'INSERT INTO saved_addresses (id, label, street, neighborhood) VALUES (?, ?, ?, ?)',
      ['addr1', 'Casa', 'Rua Ponta Negra, 123', 'Ponta Negra']
    );
    await db.runAsync(
      'INSERT INTO saved_addresses (id, label, street, neighborhood) VALUES (?, ?, ?, ?)',
      ['addr2', 'Trabalho', 'Av. Djalma Batista, 456', 'Flores']
    );

    // --- Locations ---
    const locations = [
      'Ponta Negra, Manaus',
      'Vieiralves, Manaus',
      'Cidade Nova, Manaus',
      'Adrianópolis, Manaus',
      'Parque 10 de Novembro, Manaus',
    ];
    for (const loc of locations) {
      await db.runAsync('INSERT INTO locations (name) VALUES (?)', [loc]);
    }

    // --- Demo Users ---
    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, role, student_id, instructor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['user-demo-student', 'joao@email.com', simpleHash('123456'), 'student', 'stud1', null]
    );
    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, role, student_id, instructor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['user-demo-instructor', 'instrutor@email.com', simpleHash('123456'), 'instructor', null, 'inst1']
    );
  });
}
