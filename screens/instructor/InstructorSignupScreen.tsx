import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  User,
  Calendar,
  Eye,
  EyeOff,
  Car,
  MapPin,
  DollarSign,
  FileText,
  Briefcase
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/ProgressBar';
import DocumentUpload from '@/components/DocumentUpload';
import { isValidCPF, formatCPF, formatPhone, cleanCPF } from '@/utils/cpf';

type Step = 1 | 2 | 3 | 4 | 5;

export interface InstructorSignupData {
  // RF-IN-01
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  // RF-IN-02
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
  experienceYears: string;
  instructorRegistration: string;
  experienceText: string;
  workType: 'autonomo' | 'cfc';
  // RF-IN-04
  vehicleType: 'Carro' | 'Moto' | 'Caminhão' | 'Ônibus' | 'Articulado';
  brand: string;
  carModel: string;
  year: string;
  plate: string;
  transmission: 'Manual' | 'Auto';
  hasDualControls: boolean;
  hasInsurance: boolean;
  // RF-IN-05
  city: string;
  neighborhoods: string;
  actionRadius: string;
  // RF-IN-06
  pricePerHour: string;
}

interface InstructorSignupScreenProps {
  onComplete?: (data: InstructorSignupData) => Promise<void>;
  onBack?: () => void;
}

const CNH_CATEGORIES = ['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE'];

const VEHICLE_TYPES = [
  { value: 'Carro', label: 'Carro (B)' },
  { value: 'Moto', label: 'Moto (A)' },
  { value: 'Caminhão', label: 'Caminhão (C)' },
  { value: 'Ônibus', label: 'Ônibus (D)' },
  { value: 'Articulado', label: 'Articulado (E)' },
] as const;

export default function InstructorSignupScreen({ onComplete, onBack }: InstructorSignupScreenProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 - RF-IN-01: Dados Pessoais
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cpfError, setCpfError] = useState('');

  // Step 2 - RF-IN-02: Dados Profissionais
  const [cnhNumber, setCnhNumber] = useState('');
  const [cnhCategory, setCnhCategory] = useState('');
  const [cnhExpiry, setCnhExpiry] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [instructorRegistration, setInstructorRegistration] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [workType, setWorkType] = useState<'autonomo' | 'cfc' | null>(null);

  // Step 3 - RF-IN-04: Dados do Veículo
  const [vehicleType, setVehicleType] = useState<'Carro' | 'Moto' | 'Caminhão' | 'Ônibus' | 'Articulado' | null>(null);
  const [brand, setBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [transmission, setTransmission] = useState<'Manual' | 'Auto' | null>(null);
  const [hasDualControls, setHasDualControls] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  // Step 4 - RF-IN-05 + RF-IN-06: Área de Atuação + Preço
  const [city, setCity] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');
  const [actionRadius, setActionRadius] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 5 - RF-IN-03: Documentos
  const [cnhFrontUploaded, setCnhFrontUploaded] = useState(false);
  const [cnhBackUploaded, setCnhBackUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [criminalRecordUploaded, setCriminalRecordUploaded] = useState(false);
  const [vehicleDocUploaded, setVehicleDocUploaded] = useState(false);
  const [vehiclePhotoUploaded, setVehiclePhotoUploaded] = useState(false);
  const [residenceProofUploaded, setResidenceProofUploaded] = useState(false);

  const MINIMUM_PRICE = 50;

  const handleCPFChange = (text: string) => {
    setCpf(formatCPF(text));
    setCpfError('');
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const handleDateChange = (text: string, setter: (v: string) => void) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setter(formatted);
  };

  const handleDocumentUpload = (setter: (v: boolean) => void, type: 'photo' | 'pdf') => {
    if (type === 'photo') {
      Alert.alert(
        'Selecionar Foto',
        'Como deseja adicionar a foto?',
        [
          {
            text: 'Câmera',
            onPress: async () => {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 0.8,
                allowsEditing: true,
              });
              if (!result.canceled) {
                setter(true);
              }
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar a foto.');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.8,
                allowsEditing: true,
              });
              if (!result.canceled) {
                setter(true);
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } else {
      (async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/jpeg', 'image/png'],
            copyToCacheDirectory: true,
          });
          if (!result.canceled) {
            setter(true);
          }
        } catch {
          Alert.alert('Erro', 'Não foi possível selecionar o documento.');
        }
      })();
    }
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
    if (!birthDate || birthDate.length < 10) {
      Alert.alert('Campo obrigatório', 'Informe sua data de nascimento completa.');
      return false;
    }
    const phoneCleaned = phone.replace(/\D/g, '');
    if (!phoneCleaned || phoneCleaned.length < 10) {
      Alert.alert('Campo obrigatório', 'Informe um telefone válido.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu e-mail.');
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
    if (!cnhNumber.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o número da CNH.');
      return false;
    }
    if (!cnhCategory) {
      Alert.alert('Campo obrigatório', 'Selecione a categoria da CNH.');
      return false;
    }
    if (!cnhExpiry || cnhExpiry.length < 10) {
      Alert.alert('Campo obrigatório', 'Informe a data de validade da CNH.');
      return false;
    }
    if (!experienceYears.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o tempo de habilitação.');
      return false;
    }
    if (!workType) {
      Alert.alert('Campo obrigatório', 'Selecione como você atua.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
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
    if (!year.trim() || year.length < 4) {
      Alert.alert('Campo obrigatório', 'Informe o ano do veículo.');
      return false;
    }
    if (!plate.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a placa do veículo.');
      return false;
    }
    if (!transmission) {
      Alert.alert('Campo obrigatório', 'Selecione o tipo de câmbio.');
      return false;
    }
    return true;
  };

  const validateStep4 = (): boolean => {
    if (!city.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a cidade de atuação.');
      return false;
    }
    if (!neighborhoods.trim()) {
      Alert.alert('Campo obrigatório', 'Informe os bairros atendidos.');
      return false;
    }
    if (!actionRadius.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o raio de atuação.');
      return false;
    }
    if (!pricePerHour.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o valor da hora-aula.');
      return false;
    }
    const price = parseFloat(pricePerHour.replace(',', '.'));
    if (isNaN(price) || price < MINIMUM_PRICE) {
      Alert.alert('Valor inválido', `O valor mínimo da hora-aula é R$ ${MINIMUM_PRICE},00.`);
      return false;
    }
    return true;
  };

  const validateStep5 = (): boolean => {
    if (!cnhFrontUploaded || !cnhBackUploaded) {
      Alert.alert('Documento obrigatório', 'Envie a CNH (frente e verso).');
      return false;
    }
    if (!criminalRecordUploaded) {
      Alert.alert('Documento obrigatório', 'Envie a certidão negativa de antecedentes.');
      return false;
    }
    if (!vehicleDocUploaded) {
      Alert.alert('Documento obrigatório', 'Envie o documento do veículo.');
      return false;
    }
    if (!vehiclePhotoUploaded) {
      Alert.alert('Documento obrigatório', 'Envie a foto do veículo.');
      return false;
    }
    if (!residenceProofUploaded) {
      Alert.alert('Documento obrigatório', 'Envie o comprovante de residência.');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    } else if (currentStep === 4 && validateStep4()) {
      setCurrentStep(5);
    } else if (currentStep === 5 && validateStep5()) {
      if (onComplete) {
        setIsSubmitting(true);
        try {
          await onComplete({
            name: name.trim(),
            cpf: cleanCPF(cpf),
            birthDate,
            phone: phone.replace(/\D/g, ''),
            email: email.trim(),
            password,
            cnhNumber: cnhNumber.trim(),
            cnhCategory,
            cnhExpiry,
            experienceYears: experienceYears.trim(),
            instructorRegistration: instructorRegistration.trim(),
            experienceText: experienceText.trim(),
            workType: workType!,
            vehicleType: vehicleType!,
            brand: brand.trim(),
            carModel: carModel.trim(),
            year: year.trim(),
            plate: plate.trim().toUpperCase(),
            transmission: transmission!,
            hasDualControls,
            hasInsurance,
            city: city.trim(),
            neighborhoods: neighborhoods.trim(),
            actionRadius: actionRadius.trim(),
            pricePerHour: pricePerHour.trim(),
          });
        } catch (error) {
          console.error('Erro no cadastro:', error);
          Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    } else if (onBack) {
      onBack();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <User size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
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

      <Text style={styles.label}>Data de nascimento *</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={birthDate}
        onChangeText={(t) => handleDateChange(t, setBirthDate)}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Telefone *</Text>
      <TextInput
        style={styles.input}
        placeholder="(92) 99999-9999"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        maxLength={15}
        placeholderTextColor={Colors.light.textTertiary}
      />

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
        <Briefcase size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
      </View>

      <Text style={styles.label}>Número da CNH *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o número da CNH"
        value={cnhNumber}
        onChangeText={setCnhNumber}
        keyboardType="numeric"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Categoria da CNH *</Text>
      <View style={styles.categoryGrid}>
        {CNH_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, cnhCategory === cat && styles.categoryChipActive]}
            onPress={() => setCnhCategory(cat)}
          >
            <Text style={[styles.categoryChipText, cnhCategory === cat && styles.categoryChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Data de validade da CNH *</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={cnhExpiry}
        onChangeText={(t) => handleDateChange(t, setCnhExpiry)}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Tempo de habilitação (anos) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5"
        value={experienceYears}
        onChangeText={setExperienceYears}
        keyboardType="numeric"
        maxLength={2}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Número do registro de instrutor</Text>
      <TextInput
        style={styles.input}
        placeholder="Se aplicável"
        value={instructorRegistration}
        onChangeText={setInstructorRegistration}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Experiência</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva sua experiência como instrutor..."
        value={experienceText}
        onChangeText={setExperienceText}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Atua como *</Text>
      <View style={styles.workTypeButtons}>
        <TouchableOpacity
          style={[styles.workTypeButton, workType === 'autonomo' && styles.workTypeButtonActive]}
          onPress={() => setWorkType('autonomo')}
        >
          <Text style={[styles.workTypeButtonText, workType === 'autonomo' && styles.workTypeButtonTextActive]}>
            Autônomo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.workTypeButton, workType === 'cfc' && styles.workTypeButtonActive]}
          onPress={() => setWorkType('cfc')}
        >
          <Text style={[styles.workTypeButtonText, workType === 'cfc' && styles.workTypeButtonTextActive]}>
            Vinculado a CFC
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
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

      <Text style={styles.label}>Ano *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2022"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        maxLength={4}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Placa *</Text>
      <TextInput
        style={styles.input}
        placeholder="ABC-1234 ou ABC1D23"
        value={plate}
        onChangeText={setPlate}
        autoCapitalize="characters"
        maxLength={8}
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

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Possui duplo comando?</Text>
        <Switch
          value={hasDualControls}
          onValueChange={setHasDualControls}
          trackColor={{ false: Colors.light.border, true: Colors.light.success }}
          thumbColor={Colors.light.surface}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Possui seguro?</Text>
        <Switch
          value={hasInsurance}
          onValueChange={setHasInsurance}
          trackColor={{ false: Colors.light.border, true: Colors.light.success }}
          thumbColor={Colors.light.surface}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
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

      <Text style={styles.label}>Bairros atendidos *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: Centro, Adrianópolis, Aleixo, Flores..."
        value={neighborhoods}
        onChangeText={setNeighborhoods}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Raio de atuação (km) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 15"
        value={actionRadius}
        onChangeText={setActionRadius}
        keyboardType="numeric"
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

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <FileText size={20} color={Colors.light.primary} />
        <Text style={styles.sectionTitle}>Upload de Documentos</Text>
      </View>

      <Text style={styles.docHint}>
        Formatos aceitos: JPG, PNG, PDF
      </Text>

      <DocumentUpload
        title="CNH - Frente"
        description="Foto legível da frente da CNH"
        type="photo"
        uploaded={cnhFrontUploaded}
        onPress={() => handleDocumentUpload(setCnhFrontUploaded, 'photo')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="CNH - Verso"
        description="Foto legível do verso da CNH"
        type="photo"
        uploaded={cnhBackUploaded}
        onPress={() => handleDocumentUpload(setCnhBackUploaded, 'photo')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Certificado de Instrutor"
        description="Se aplicável - foto ou PDF do certificado"
        type="pdf"
        uploaded={certificateUploaded}
        onPress={() => handleDocumentUpload(setCertificateUploaded, 'pdf')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Certidão Negativa de Antecedentes"
        description="Documento obrigatório"
        type="pdf"
        uploaded={criminalRecordUploaded}
        onPress={() => handleDocumentUpload(setCriminalRecordUploaded, 'pdf')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Documento do Veículo (CRLV)"
        description="Foto ou PDF do documento do veículo"
        type="pdf"
        uploaded={vehicleDocUploaded}
        onPress={() => handleDocumentUpload(setVehicleDocUploaded, 'pdf')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Foto do Veículo"
        description="Foto do veículo que será utilizado nas aulas"
        type="photo"
        uploaded={vehiclePhotoUploaded}
        onPress={() => handleDocumentUpload(setVehiclePhotoUploaded, 'photo')}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Comprovante de Residência"
        description="Conta de luz, água ou outro comprovante recente"
        type="pdf"
        uploaded={residenceProofUploaded}
        onPress={() => handleDocumentUpload(setResidenceProofUploaded, 'pdf')}
      />
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  const stepTitles: Record<Step, string> = {
    1: 'Dados Pessoais',
    2: 'Dados Profissionais',
    3: 'Seu Veículo',
    4: 'Área e Preço',
    5: 'Documentos',
  };

  const buttonTexts: Record<Step, string> = {
    1: 'Próximo: Dados Profissionais',
    2: 'Próximo: Veículo',
    3: 'Próximo: Área e Preço',
    4: 'Próximo: Documentos',
    5: 'Enviar para Análise',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{stepTitles[currentStep]}</Text>
            <Text style={styles.stepIndicator}>{currentStep}/5</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar currentStep={currentStep} totalSteps={5} />
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {renderStepContent()}
        </ScrollView>

        {/* Next Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 5 && styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleNext}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? 'Enviando...' : buttonTexts[currentStep]}
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
  textArea: {
    minHeight: 90,
    paddingTop: 14,
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
  workTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  workTypeButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  workTypeButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.infoLight,
  },
  workTypeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  workTypeButtonTextActive: {
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  switchLabel: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    flex: 1,
    marginRight: 12,
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
  docHint: {
    fontSize: 13,
    color: Colors.light.info,
    backgroundColor: Colors.light.infoLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  docSpacer: {
    height: 16,
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
