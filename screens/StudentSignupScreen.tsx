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
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  CreditCard,
  Calendar
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AppCarIcon from '@/components/AppCarIcon';
import { isValidCPF, formatCPF, formatPhone, cleanCPF } from '@/utils/cpf';

const { height } = Dimensions.get('window');

export interface StudentSignupData {
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
}

interface StudentSignupScreenProps {
  onSignupComplete: (data: StudentSignupData) => void;
  onBack: () => void;
}

export default function StudentSignupScreen({ onSignupComplete, onBack }: StudentSignupScreenProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cpfError, setCpfError] = useState('');

  const handleCPFChange = (text: string) => {
    const formatted = formatCPF(text);
    setCpf(formatted);
    setCpfError('');
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const handleBirthDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setBirthDate(formatted);
  };

  const handleSignup = () => {
    if (!name.trim()) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe seu nome completo.');
      return;
    }

    const cleanedCpf = cleanCPF(cpf);
    if (!cleanedCpf) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe seu CPF.');
      return;
    }
    if (!isValidCPF(cleanedCpf)) {
      setCpfError('CPF invalido. Verifique os digitos informados.');
      return;
    }

    if (!birthDate || birthDate.length < 10) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe sua data de nascimento completa.');
      return;
    }

    const phoneCleaned = phone.replace(/\D/g, '');
    if (!phoneCleaned || phoneCleaned.length < 10) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe um telefone celular valido.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe seu e-mail.');
      return;
    }

    if (!password) {
      Alert.alert('Campo obrigatorio', 'Por favor, crie uma senha.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Senha fraca', 'A senha deve ter no minimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas nao coincidem.');
      return;
    }

    setIsLoading(true);
    onSignupComplete({
      name: name.trim(),
      cpf: cleanedCpf,
      birthDate,
      phone: phoneCleaned,
      email: email.trim(),
      password,
    });
    setIsLoading(false);
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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={Colors.light.surface} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <AppCarIcon size={40} useGradient={false} color="#FFFFFF" showPlus />
            </View>
            <Text style={styles.appName}>Habilitar+</Text>
            <Text style={styles.tagline}>Cadastro de Aluno</Text>
          </View>

          {/* Signup Card */}
          <View style={styles.signupCard}>
            <Text style={styles.cardTitle}>Dados do Aluno</Text>
            <Text style={styles.cardSubtitle}>Preencha seus dados para comecar</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome completo *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
            </View>

            {/* CPF Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CPF *</Text>
              <View style={[styles.inputContainer, cpfError ? styles.inputContainerError : null]}>
                <CreditCard size={20} color={cpfError ? Colors.light.error : Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={handleCPFChange}
                  keyboardType="numeric"
                  maxLength={14}
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
              {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}
            </View>

            {/* Birth Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de nascimento *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={birthDate}
                  onChangeText={handleBirthDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone celular *</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="(92) 99999-9999"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={15}
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail *</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
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
              <Text style={styles.inputLabel}>Senha *</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Minimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.textTertiary}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar senha *</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.textTertiary}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Criando conta...' : 'Criar Conta de Aluno'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Ja tem uma conta?</Text>
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.loginLink}> Faca login</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: Math.max(height * 0.04, 36),
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.surface,
    fontWeight: '600',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.surface,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  signupCard: {
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
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 6,
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
  inputContainerError: {
    borderColor: Colors.light.error,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.error,
    marginTop: 4,
  },
  signupButton: {
    backgroundColor: Colors.light.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.light.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
});
