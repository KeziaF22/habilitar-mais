import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth, Appointment } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { InstructorStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<InstructorStackParamList, 'InstructorDashboard'>;

export default function InstructorDashboardScreen({ navigation }: Props) {
  const { appointments, instructors, students } = useAuth();

  const currentInstructor = instructors[0];

  const instructorsAppointments = useMemo(
    () => appointments.filter((appt) => appt.instructorId === currentInstructor.id),
    [appointments, currentInstructor.id]
  );

  const today = new Date();

  const nextAppointment: Appointment | undefined = instructorsAppointments
    .filter((appt) => appt.status !== 'Recusada')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateA.getTime() - dateB.getTime();
    })
    .find((appt) => {
      const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
      return apptDateTime > today;
    });

  const dailyEarnings = instructorsAppointments
    .filter((appt) => isToday(new Date(appt.date)) && appt.status === 'Aceita')
    .reduce((sum, appt) => sum + appt.price, 0);

  const getStudentName = (studentId: string) =>
    students.find((student) => student.id === studentId)?.name ?? 'Aluno';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá, {currentInstructor.name}!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Próxima Aula</Text>
        {nextAppointment ? (
          <>
            <Text style={styles.cardText}>Aluno: {getStudentName(nextAppointment.studentId)}</Text>
            <Text style={styles.cardText}>
              Data: {format(new Date(nextAppointment.date), 'dd/MM/yyyy', { locale: ptBR })}
            </Text>
            <Text style={styles.cardText}>Hora: {nextAppointment.time}</Text>
            <Text style={styles.cardText}>Local: {nextAppointment.location}</Text>
          </>
        ) : (
          <Text style={styles.cardText}>Nenhuma aula agendada.</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: Colors.light.accent }]}>
        <Text style={[styles.cardTitle, { color: Colors.light.surface }]}>Ganhos do Dia</Text>
        <Text style={[styles.earningsText, { color: Colors.light.surface }]}>R$ {dailyEarnings.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.sectionLabel}>Gerenciar agenda</Text>
        <Text style={styles.sectionHint}>Acompanhe e responda às solicitações de aula.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('InstructorAgenda')} style={styles.linkButton}>
          <Text style={styles.linkText}>Ver Agenda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 30,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.brand,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    marginBottom: 5,
  },
  earningsText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  actions: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.brand,
  },
});
