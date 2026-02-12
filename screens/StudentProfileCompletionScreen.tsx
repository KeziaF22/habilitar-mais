import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AppCarIcon from '@/components/AppCarIcon';

const { height } = Dimensions.get('window');

interface StudentProfileCompletionScreenProps {
  studentName: string;
  onComplete: () => void;
}

export default function StudentProfileCompletionScreen({
  studentName,
  onComplete,
}: StudentProfileCompletionScreenProps) {
  const firstName = studentName.split(' ')[0];

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CheckCircle size={64} color={Colors.light.success} />
          </View>
        </View>

        <Text style={styles.title}>Tudo pronto, {firstName}!</Text>
        <Text style={styles.subtitle}>
          Sua conta de aluno foi criada com sucesso. Agora voce pode buscar instrutores proximos e agendar suas aulas.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Search size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Busque instrutores na sua regiao</Text>
          </View>
          <View style={styles.featureItem}>
            <AppCarIcon size={20} useGradient={false} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Compare precos e avaliacoes</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Comecar a Buscar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.surface,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    gap: 16,
    marginBottom: 48,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  button: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
