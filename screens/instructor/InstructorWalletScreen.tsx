import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Wallet } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function InstructorWalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Wallet size={64} color={Colors.light.success} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Carteira</Text>
        <Text style={styles.message}>
          Aqui você acompanhará seus ganhos, histórico de pagamentos, estatísticas financeiras e poderá solicitar saques.
        </Text>
        <Text style={styles.comingSoon}>Em breve! 💰</Text>
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
    backgroundColor: Colors.light.successLight,
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
    color: Colors.light.success,
  },
});
