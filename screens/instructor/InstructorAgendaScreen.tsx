import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth, Appointment } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function InstructorAgendaScreen() {
  const { appointments, instructors, updateAppointmentStatus, students } = useAuth();

  const currentInstructor = instructors[0];

  const instructorsPendingAppointments = appointments.filter(
    (appt) => appt.instructorId === currentInstructor.id && appt.status === 'Pendente'
  );

  const instructorsAllAppointments = appointments.filter(
    (appt) => appt.instructorId === currentInstructor.id
  );

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : 'Aluno Desconhecido';
  };

  const handleUpdateStatus = (id: string, status: 'Aceita' | 'Recusada') => {
    updateAppointmentStatus(id, status);
    Alert.alert('Sucesso', `Aula ${status === 'Aceita' ? 'aceita' : 'recusada'}!`);
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Solicitação de Aula</Text>
      <Text style={styles.cardText}>Aluno: {getStudentName(item.studentId)}</Text>
      <Text style={styles.cardText}>Data: {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}</Text>
      <Text style={styles.cardText}>Hora: {item.time}</Text>
      <Text style={styles.cardText}>Local: {item.location}</Text>
      <Text style={styles.cardText}>Status: {item.status}</Text>

      {item.status === 'Pendente' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleUpdateStatus(item.id, 'Aceita')}
          >
            <Text style={styles.buttonText}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleUpdateStatus(item.id, 'Recusada')}
          >
            <Text style={styles.buttonText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {instructorsPendingAppointments.length > 0 ? (
        <FlatList
          data={instructorsPendingAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noAppointmentsText}>Nenhum pedido de aula pendente.</Text>
      )}

      <Text style={styles.allAppointmentsHeader}>Todas as Aulas</Text>
      <FlatList
        data={instructorsAllAppointments.filter((appt) => appt.status !== 'Pendente')}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id + '-all'}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.brand,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: Colors.light.accent,
  },
  rejectButton: {
    backgroundColor: Colors.light.error,
  },
  buttonText: {
    color: Colors.light.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  allAppointmentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
