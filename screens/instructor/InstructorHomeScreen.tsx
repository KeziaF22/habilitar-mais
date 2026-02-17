import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Car, Star } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import StatsCard from '@/components/StatsCard';
import NextClassCard from '@/components/NextClassCard';
import DailyChecklist from '@/components/DailyChecklist';

export default function InstructorHomeScreen() {
  const { currentInstructor, appointments, students } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  const [checklistItems, setChecklistItems] = useState([
    { id: '1', label: 'Pneus', completed: true },
    { id: '2', label: 'Combustível', completed: true },
    { id: '3', label: 'Limpeza', completed: true },
  ]);

  const [classStarted, setClassStarted] = useState(false);

  const { todayEarnings, classesCompleted, totalClassesToday, nextClass } = useMemo(() => {
    if (!currentInstructor) {
      return { todayEarnings: 0, classesCompleted: 0, totalClassesToday: 0, nextClass: null };
    }

    const myAppointments = appointments.filter(
      (apt) => apt.instructorId === currentInstructor.id
    );

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const todayAccepted = myAppointments.filter(
      (apt) => apt.date === todayStr && apt.status === 'Aceita'
    );
    const todayAll = myAppointments.filter(
      (apt) => apt.date === todayStr && apt.status !== 'Recusada' && apt.status !== 'Cancelada'
    );

    const earnings = todayAccepted.reduce((sum, apt) => sum + (apt.totalPrice ?? apt.price), 0);

    // Next upcoming accepted appointment (today or future)
    const upcoming = myAppointments
      .filter((apt) => apt.status === 'Aceita' && apt.date >= todayStr)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });

    const nextApt = upcoming[0] ?? null;

    let nextClassData = null;
    if (nextApt) {
      const student = students.find((s) => s.id === nextApt.studentId);
      const studentName = student?.name ?? 'Aluno';
      const encodedName = encodeURIComponent(studentName);

      nextClassData = {
        appointmentId: nextApt.id,
        studentName,
        studentAvatar: `https://ui-avatars.com/api/?name=${encodedName}&background=1E3A5F&color=fff`,
        classNumber: `${nextApt.time} - ${nextApt.date.split('-').reverse().join('/')}`,
        address: nextApt.address ?? nextApt.location,
        phone: student?.phone ?? '',
      };
    }

    return {
      todayEarnings: earnings,
      classesCompleted: todayAccepted.length,
      totalClassesToday: todayAll.length,
      nextClass: nextClassData,
    };
  }, [appointments, students, currentInstructor]);

  const rating = 4.8;

  const handleToggleChecklist = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleCall = () => {
    if (!nextClass?.phone) {
      Alert.alert('Indisponível', 'Telefone do aluno não cadastrado.');
      return;
    }
    Linking.openURL(`tel:${nextClass.phone}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o discador.');
    });
  };

  const handleMessage = () => {
    if (!nextClass?.phone) {
      Alert.alert('Indisponível', 'Telefone do aluno não cadastrado.');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=55${nextClass.phone}`;
    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          Linking.openURL(`sms:${nextClass.phone}`);
        }
      })
      .catch(() => {
        Linking.openURL(`sms:${nextClass.phone}`).catch(() => {
          Alert.alert('Erro', 'Não foi possível abrir o app de mensagens.');
        });
      });
  };

  const handleNavigate = () => {
    if (!nextClass?.address) return;
    const address = encodeURIComponent(nextClass.address);
    const url = Platform.select({
      ios: `maps://app?daddr=${address}`,
      android: `google.navigation:q=${address}`,
      default: `https://www.google.com/maps/search/?api=1&query=${address}`,
    });
    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`).catch(() => {
          Alert.alert('Erro', 'Não foi possível abrir o mapa.');
        });
      });
    }
  };

  const handleStartClass = () => {
    if (!nextClass) return;
    if (classStarted) {
      Alert.alert('Aula em andamento', 'A aula já foi iniciada.');
      return;
    }
    Alert.alert(
      'Iniciar Aula',
      `Deseja iniciar a aula com ${nextClass.studentName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: () => {
            setClassStarted(true);
            Alert.alert('Aula Iniciada', `Aula com ${nextClass.studentName} iniciada com sucesso!`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {currentInstructor?.name || 'Carlos'}</Text>
        </View>
        <View style={styles.availabilityToggle}>
          <Text style={styles.availabilityLabel}>Disponível</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: Colors.light.border, true: Colors.light.success }}
            thumbColor={Colors.light.surface}
          />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatsCard
          icon={DollarSign}
          iconColor={Colors.light.success}
          iconBgColor={Colors.light.successLight}
          label="Ganhos Hoje"
          value={`R$ ${todayEarnings}`}
        />
        <StatsCard
          icon={Car}
          iconColor={Colors.light.primary}
          iconBgColor={Colors.light.infoLight}
          label="Aulas"
          value={`${classesCompleted}/${totalClassesToday}`}
          progress={totalClassesToday > 0 ? classesCompleted / totalClassesToday : 0}
        />
        <StatsCard
          icon={Star}
          iconColor={Colors.light.warning}
          iconBgColor={Colors.light.warningLight}
          label="Nota"
          value={`★ ${rating}`}
        />
      </View>

      {/* Next Class */}
      {nextClass && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima Aula</Text>
          <NextClassCard
            studentName={nextClass.studentName}
            studentAvatar={nextClass.studentAvatar}
            classNumber={nextClass.classNumber}
            address={nextClass.address}
            onCall={handleCall}
            onMessage={handleMessage}
            onNavigate={handleNavigate}
            onStartClass={handleStartClass}
          />
        </View>
      )}

      {/* Daily Checklist */}
      <View style={styles.section}>
        <DailyChecklist
          items={checklistItems}
          onToggleItem={handleToggleChecklist}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
});
