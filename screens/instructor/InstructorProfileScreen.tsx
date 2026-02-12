import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function InstructorProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <User size={64} color={Colors.light.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.message}>
          Aqui você poderá editar suas informações pessoais, dados do veículo, horários de disponibilidade e configurações da conta.
        </Text>
        <Text style={styles.comingSoon}>Em breve! 👤</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
