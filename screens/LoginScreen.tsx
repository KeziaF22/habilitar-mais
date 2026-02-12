import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { setUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    // Simulate login - replace with real authentication
    setTimeout(() => {
      setIsLoading(false);
      // For demo, any email/password will work
      // You can add role detection logic here based on email
      if (email.includes('instrutor') || email.includes('instructor')) {
        setUserRole('instructor');
      } else {
        setUserRole('student');
      }
    }, 1000);
  };

  const handleSkipToOnboarding = () => {
    setUserRole(null); // Reset to show onboarding
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primaryDark]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Car size={48} color={Colors.light.surface} strokeWidth={2} />
            </View>
            <Text style={styles.appName}>Habilitar+</Text>
            <Text style={styles.tagline}>Conectando alunos a instrutores</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.cardTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.cardSubtitle}>Faça login para continuar</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.inputContainer}>
                <Mail
                  size={20}
                  color={Colors.light.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputContainer}>
                <Lock
                  size={20}
                  color={Colors.light.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={Colors.light.textTertiary}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading || !email || !password}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={handleSkipToOnboarding}>
                <Text style={styles.signupLink}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Hint */}
            <View style={styles.demoHint}>
              <Text style={styles.demoHintText}>💡 Demo: Use qualquer e-mail/senha</Text>
              <Text style={styles.demoHintText}>
                E-mail com "instrutor" → Área do Instrutor
              </Text>
              <Text style={styles.demoHintText}>Outros e-mails → Área do Aluno</Text>
            </View>
          </View>

          {/* Footer */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipToOnboarding}
          >
            <Text style={styles.skipButtonText}>Pular para seleção de perfil</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Math.max(height * 0.08, 40),
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.surface,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loginCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  demoHint: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.infoLight,
    borderRadius: 12,
    gap: 4,
  },
  demoHintText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
  },
});
