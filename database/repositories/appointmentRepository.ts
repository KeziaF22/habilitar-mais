import { getDatabase } from '../connection';
import type { Appointment } from '@/context/AuthContext';

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await getDatabase();
  return db.getAllAsync<Appointment>('SELECT * FROM appointments');
}

export async function addAppointment(appointment: Appointment): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO appointments (id, studentId, instructorId, date, time, location, status, price, address, paymentMethod, serviceFee, discount, totalPrice)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      appointment.id,
      appointment.studentId,
      appointment.instructorId,
      appointment.date,
      appointment.time,
      appointment.location,
      appointment.status,
      appointment.price,
      appointment.address ?? null,
      appointment.paymentMethod ?? null,
      appointment.serviceFee ?? null,
      appointment.discount ?? null,
      appointment.totalPrice ?? null,
    ]
  );
}

export async function updateAppointmentStatus(
  id: string,
  status: 'Aceita' | 'Recusada'
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
}
