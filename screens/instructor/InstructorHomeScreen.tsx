import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { DollarSign, Car, Star } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import StatsCard from '@/components/StatsCard';
import NextClassCard from '@/components/NextClassCard';
import DailyChecklist from '@/components/DailyChecklist';

export default function InstructorHomeScreen() {
  const { currentInstructor } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  const [checklistItems, setChecklistItems] = useState([
    { id: '1', label: 'Pneus', completed: true },
    { id: '2', label: 'Combustível', completed: true },
    { id: '3', label: 'Limpeza', completed: true },
  ]);

  // Mock data - replace with real data from context
  const todayEarnings = 240;
  const classesCompleted = 3;
  const totalClassesToday = 5;
  const rating = 4.8;

  // Mock next class data
  const nextClass = {
    studentName: 'João Paulo',
    studentAvatar: 'https://ui-avatars.com/api/?name=Joao+Paulo&background=1E3A5F&color=fff',
    classNumber: 'Aula 1/10',
    address: 'Rua Ponta Negra, 123',
  };

  const handleToggleChecklist = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleCall = () => {
    Alert.alert('Ligar', 'Funcionalidade de chamada será implementada');
  };

  const handleMessage = () => {
    Alert.alert('Mensagem', 'Funcionalidade de mensagem será implementada');
  };

  const handleNavigate = () => {
    Alert.alert('Navegar', 'Abrindo navegação no mapa...');
  };

  const handleStartClass = () => {
    Alert.alert('Iniciar Aula', 'Aula iniciada com sucesso!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          progress={classesCompleted / totalClassesToday}
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

      {/* Daily Checklist */}
      <View style={styles.section}>
        <DailyChecklist
          items={checklistItems}
          onToggleItem={handleToggleChecklist}
        />
      </View>
    </ScrollView>
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
