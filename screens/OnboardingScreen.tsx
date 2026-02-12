import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import OnboardingIllustration from '@/components/OnboardingIllustration';
import AppCarIcon from '@/components/AppCarIcon';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onRoleSelected?: (role: 'student' | 'instructor') => void;
}

export default function OnboardingScreen({ onRoleSelected }: OnboardingScreenProps) {
  const { setUserRole } = useAuth();

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.primaryDark, '#1D4ED8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <AppCarIcon size={60} useGradient={false} color="#FFFFFF" showPlus />
        </View>
        <Text style={styles.appName}>Habilitar+</Text>
        <Text style={styles.tagline}>Conectando alunos a instrutores de direção</Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <OnboardingIllustration width={280} height={280} />
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Bem-vindo!</Text>
        <Text style={styles.ctaSubtitle}>Como você gostaria de continuar?</Text>

        <View style={styles.buttonContainer}>
          {/* Student Button */}
          <TouchableOpacity
            style={[styles.button, styles.studentButton]}
            onPress={() => onRoleSelected ? onRoleSelected('student') : setUserRole('student')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <GraduationCap size={28} color={Colors.light.surface} strokeWidth={2.5} />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Sou Aluno</Text>
              <Text style={styles.buttonSubtitle}>Encontre instrutores qualificados</Text>
            </View>
          </TouchableOpacity>

          {/* Instructor Button */}
          <TouchableOpacity
            style={[styles.button, styles.instructorButton]}
            onPress={() => onRoleSelected ? onRoleSelected('instructor') : setUserRole('instructor')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <AppCarIcon size={28} useGradient={false} color="#FFFFFF" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Sou Instrutor</Text>
              <Text style={styles.buttonSubtitle}>Conecte-se com novos alunos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sua jornada começa aqui 🚗</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.light.surface,
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Illustration
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.surface,
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Buttons
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  studentButton: {
    backgroundColor: Colors.light.success,
  },
  instructorButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.surface,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Footer
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
});
