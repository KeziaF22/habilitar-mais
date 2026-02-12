import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin } from 'lucide-react-native';
import { useAuth, Appointment } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

type TabType = 'upcoming' | 'history';

export default function MyClassesScreen() {
  const { appointments, currentStudent, instructors } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const myAppointments = useMemo(() => {
    return appointments.filter((apt) => apt.studentId === currentStudent.id);
  }, [appointments, currentStudent.id]);

  const { upcomingAppointments, historyAppointments } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = myAppointments.filter((apt) => {
      const aptDate = parseISO(apt.date);
      return (
        (apt.status === 'Pendente' || apt.status === 'Aceita') &&
        (aptDate >= today || aptDate.toDateString() === today.toDateString())
      );
    });

    const history = myAppointments.filter((apt) => {
      const aptDate = parseISO(apt.date);
      return aptDate < today || apt.status === 'Recusada';
    });

    return { upcomingAppointments: upcoming, historyAppointments: history };
  }, [myAppointments]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pendente':
        return { backgroundColor: '#FFF9C4', color: '#F57F17' };
      case 'Aceita':
        return { backgroundColor: '#C8E6C9', color: '#2E7D32' };
      case 'Recusada':
        return { backgroundColor: '#FFCDD2', color: '#C62828' };
      default:
        return { backgroundColor: '#E0E0E0', color: '#616161' };
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const instructor = instructors.find((inst) => inst.id === item.instructorId);
    if (!instructor) return null;

    const badgeStyle = getStatusBadgeStyle(item.status);
    const formattedDate = format(parseISO(item.date), "dd 'de' MMMM", { locale: ptBR });

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: instructor.profileImage }} style={styles.instructorAvatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.instructorName}>{instructor.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: badgeStyle.backgroundColor }]}>
              <Text style={[styles.statusText, { color: badgeStyle.color }]}>{item.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={18} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>
            {formattedDate} às {item.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin size={18} color={Colors.light.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>R$ {item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : historyAppointments;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Aulas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      {displayedAppointments.length > 0 ? (
        <FlatList
          data={displayedAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Calendar size={64} color={Colors.light.textSecondary} />
          <Text style={styles.emptyText}>
            {activeTab === 'upcoming'
              ? 'Você não tem aulas agendadas'
              : 'Nenhuma aula no histórico'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.light.brand,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.surface,
  },
  listContent: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.brand,
  },
  detailButton: {
    backgroundColor: Colors.light.brand,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailButtonText: {
    color: Colors.light.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
