import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Eye, EyeOff, Car, MapPin, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/ProgressBar';
import { isValidCPF, formatCPF, cleanCPF } from '@/utils/cpf';

export interface InstructorSignupData {
  name: string;
  cpf: string;
  email: string;
  password: string;
  vehicleType: 'Carro' | 'Moto' | 'Caminhão' | 'Ônibus' | 'Articulado';
  brand: string;
  carModel: string;
  transmission: 'Manual' | 'Auto';
  city: string;
  pricePerHour: string;
}

interface InstructorSignupScreenProps {
  onComplete: (data: InstructorSignupData) => Promise<void>;
  onBack?: () => void;
}

const MINIMUM_PRICE = 50;

const VEHICLE_TYPES = [
  { value: 'Carro', label: 'Carro (B)' },
  { value: 'Moto', label: 'Moto (A)' },
  { value: 'Caminhão', label: 'Caminhão (C)' },
  { value: 'Ônibus', label: 'Ônibus (D)' },
  { value: 'Articulado', label: 'Articulado (E)' },
] as const;

export default function InstructorSignupScreen({ onComplete, onBack }: InstructorSignupScreenProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cpfError, setCpfError] = useState('');

  const [vehicleType, setVehicleType] = useState<'Carro' | 'Moto' | 'Caminhão' | 'Ônibus' | 'Articulado' | null>(null);
  const [brand, setBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [transmission, setTransmission] = useState<'Manual' | 'Auto' | null>(null);

  const [city, setCity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCPFChange = (text: string) => {
    setCpf(formatCPF(text));
    setCpfError('');
  };

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu nome completo.');
      return false;
    }
    const cleanedCpf = cleanCPF(cpf);
    if (!cleanedCpf) {
      Alert.alert('Campo obrigatório', 'Informe seu CPF.');
      return false;
    }
    if (!isValidCPF(cleanedCpf)) {
      setCpfError('CPF inválido. Verifique os dígitos informados.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu e-mail.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return false;
    }
    if (!password) {
      Alert.alert('Campo obrigatório', 'Crie uma senha.');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 8 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!vehicleType) {
      Alert.alert('Campo obrigatório', 'Selecione o tipo de veículo.');
      return false;
    }
    if (!brand.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a marca do veículo.');
      return false;
    }
    if (!carModel.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o modelo do veículo.');
      return false;
    }
    if (!transmission) {
      Alert.alert('Campo obrigatório', 'Selecione o tipo de câmbio.');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a cidade de atuação.');
      return false;
    }
    const price = Number(pricePerHour.trim().replace(',', '.'));
    if (!Number.isFinite(price) || price < MINIMUM_PRICE) {
      Alert.alert('Valor inválido', 'O valor mínimo da hora-aula é R$ 50,00.');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
      return;
    }
    if (!validateStep2()) return;
    setIsSubmitting(true);
    try {
      await onComplete({
        name: name.trim(), cpf: cleanCPF(cpf), email: email.trim(), password,
        vehicleType: vehicleType!, brand: brand.trim(), carModel: carModel.trim(),
        transmission: transmission!, city: city.trim(), pricePerHour: pricePerHour.trim(),
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isSubmitting) return;
    if (currentStep === 2) setCurrentStep(1);
    else onBack?.();
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <User size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Sua conta</Text>
      </View>

      <Text style={styles.label}>Nome completo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        style={[styles.input, cpfError ? styles.inputError : null]}
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={handleCPFChange}
        keyboardType="numeric"
        maxLength={14}
        placeholderTextColor={Colors.light.textTertiary}
      />
      {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}

      <Text style={styles.label}>E-mail *</Text>
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

      <Text style={styles.label}>Senha *</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mínimo 8 caracteres"
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

      <Text style={styles.label}>Confirmar senha *</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
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
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Car size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Dados do Veículo</Text>
      </View>

      <Text style={styles.label}>Tipo de Veículo *</Text>
      <View style={styles.categoryGrid}>
        {VEHICLE_TYPES.map((vt) => (
          <TouchableOpacity
            key={vt.value}
            style={[styles.categoryChip, vehicleType === vt.value && styles.categoryChipActive]}
            onPress={() => setVehicleType(vt.value)}
          >
            <Text style={[styles.categoryChipText, vehicleType === vt.value && styles.categoryChipTextActive]}>
              {vt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Marca *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Honda, Toyota, Volkswagen"
        value={brand}
        onChangeText={setBrand}
        autoCapitalize="words"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Modelo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Fit, Corolla, Gol"
        value={carModel}
        onChangeText={setCarModel}
        autoCapitalize="words"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Tipo de câmbio *</Text>
      <View style={styles.transmissionButtons}>
        <TouchableOpacity
          style={[styles.transmissionButton, transmission === 'Manual' && styles.transmissionButtonActive]}
          onPress={() => setTransmission('Manual')}
        >
          <Text style={[styles.transmissionButtonText, transmission === 'Manual' && styles.transmissionButtonTextActive]}>
            Manual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.transmissionButton, transmission === 'Auto' && styles.transmissionButtonActive]}
          onPress={() => setTransmission('Auto')}
        >
          <Text style={[styles.transmissionButtonText, transmission === 'Auto' && styles.transmissionButtonTextActive]}>
            Automático
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <MapPin size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Área de Atuação</Text>
      </View>

      <Text style={styles.label}>Cidade *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Manaus"
        value={city}
        onChangeText={setCity}
        autoCapitalize="words"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <View style={styles.sectionDivider} />

      <View style={styles.sectionHeader}>
        <DollarSign size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Valor da Hora-Aula</Text>
      </View>

      <Text style={styles.priceHint}>
        Valor mínimo permitido pela plataforma: R$ {MINIMUM_PRICE},00
      </Text>

      <Text style={styles.label}>Preço por hora (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder={`Ex: ${MINIMUM_PRICE}`}
        value={pricePerHour}
        onChangeText={setPricePerHour}
        keyboardType="numeric"
        placeholderTextColor={Colors.light.textTertiary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} disabled={isSubmitting} accessibilityLabel="Voltar" style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{currentStep === 1 ? 'Sua conta' : 'Suas aulas'}</Text>
            <Text style={styles.stepIndicator}>{`${currentStep}/2`}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar currentStep={currentStep} totalSteps={2} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 2 && styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleNext}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? 'Enviando...' : currentStep === 1 ? 'Próximo: Aulas' : 'Finalizar Cadastro'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContent: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.error,
    marginTop: -4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  categoryChipActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.infoLight,
  },
  categoryChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.light.primary,
  },
  transmissionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  transmissionButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  transmissionButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.infoLight,
  },
  transmissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  transmissionButtonTextActive: {
    color: Colors.light.primary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  priceHint: {
    fontSize: 13,
    color: Colors.light.info,
    backgroundColor: Colors.light.infoLight,
    padding: 12,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  nextButton: {
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
  submitButton: {
    backgroundColor: Colors.light.success,
    shadowColor: Colors.light.success,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
});
