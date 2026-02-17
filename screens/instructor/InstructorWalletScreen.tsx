import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, TrendingUp, Calendar, Wallet } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth, Appointment } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function InstructorWalletScreen() {
  const { appointments, students, currentInstructor } = useAuth();

  const { totalEarnings, monthEarnings, completedClasses, transactions } = useMemo(() => {
    if (!currentInstructor) {
      return { totalEarnings: 0, monthEarnings: 0, completedClasses: 0, transactions: [] };
    }

    const accepted = appointments.filter(
      (apt) => apt.instructorId === currentInstructor.id && apt.status === 'Aceita'
    );

    const total = accepted.reduce((sum, apt) => sum + (apt.totalPrice ?? apt.price), 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTotal = accepted
      .filter((apt) => {
        const d = parseISO(apt.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, apt) => sum + (apt.totalPrice ?? apt.price), 0);

    const sorted = [...accepted].sort((a, b) =>
      parseISO(b.date).getTime() - parseISO(a.date).getTime()
    );

    return {
      totalEarnings: total,
      monthEarnings: monthTotal,
      completedClasses: accepted.length,
      transactions: sorted,
    };
  }, [appointments, currentInstructor]);

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name ?? 'Aluno';
  };

  const renderTransaction = ({ item }: { item: Appointment }) => {
    const formattedDate = format(parseISO(item.date), "dd 'de' MMM", { locale: ptBR });
    const value = item.totalPrice ?? item.price;

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIconContainer}>
            <DollarSign size={18} color={Colors.light.success} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>{getStudentName(item.studentId)}</Text>
            <Text style={styles.transactionDate}>{formattedDate} - {item.time}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionValue}>R$ {value.toFixed(2)}</Text>
          <View style={styles.receivedBadge}>
            <Text style={styles.receivedBadgeText}>Recebido</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceIconCircle}>
          <Wallet size={28} color={Colors.light.surface} />
        </View>
        <Text style={styles.balanceLabel}>Saldo Total</Text>
        <Text style={styles.balanceValue}>R$ {totalEarnings.toFixed(2)}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <TrendingUp size={22} color={Colors.light.success} />
          <Text style={styles.statValue}>R$ {monthEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Ganhos do Mês</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={22} color={Colors.light.primary} />
          <Text style={styles.statValue}>{completedClasses}</Text>
          <Text style={styles.statLabel}>Aulas Concluídas</Text>
        </View>
      </View>

      {/* History Header */}
      <Text style={styles.historyTitle}>Histórico de Ganhos</Text>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <DollarSign size={48} color={Colors.light.textTertiary} />
      <Text style={styles.emptyText}>Nenhuma aula concluída ainda</Text>
      <Text style={styles.emptySubtext}>
        Seus ganhos aparecerão aqui quando você aceitar e concluir aulas.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carteira</Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  balanceCard: {
    backgroundColor: Colors.light.success,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.light.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  transactionDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.success,
  },
  receivedBadge: {
    backgroundColor: Colors.light.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  receivedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.success,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
