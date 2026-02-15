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
  onComplete?: (data: InstructorSignupData) => void;
  onBack?: () => void;
}

const CNH_CATEGORIES = ['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE'];

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

  // Step 3 - RF-IN-04: Dados do Veiculo
  const [brand, setBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [transmission, setTransmission] = useState<'Manual' | 'Auto' | null>(null);
  const [hasDualControls, setHasDualControls] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  // Step 4 - RF-IN-05 + RF-IN-06: Area de Atuacao + Preco
  const [city, setCity] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');
  const [actionRadius, setActionRadius] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

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

  const handleDocumentUpload = (setter: (v: boolean) => void) => {
    Alert.alert(
      'Upload de Documento',
      'Formatos aceitos: JPG, PNG, PDF.\nFuncionalidade de upload sera implementada. Por enquanto, marcando como enviado.',
      [{ text: 'OK', onPress: () => setter(true) }]
    );
  };

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe seu nome completo.');
      return false;
    }
    const cleanedCpf = cleanCPF(cpf);
    if (!cleanedCpf) {
      Alert.alert('Campo obrigatorio', 'Informe seu CPF.');
      return false;
    }
    if (!isValidCPF(cleanedCpf)) {
      setCpfError('CPF invalido. Verifique os digitos informados.');
      return false;
    }
    if (!birthDate || birthDate.length < 10) {
      Alert.alert('Campo obrigatorio', 'Informe sua data de nascimento completa.');
      return false;
    }
    const phoneCleaned = phone.replace(/\D/g, '');
    if (!phoneCleaned || phoneCleaned.length < 10) {
      Alert.alert('Campo obrigatorio', 'Informe um telefone valido.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe seu e-mail.');
      return false;
    }
    if (!password) {
      Alert.alert('Campo obrigatorio', 'Crie uma senha.');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Senha fraca', 'A senha deve ter no minimo 8 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas nao coincidem.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!cnhNumber.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o numero da CNH.');
      return false;
    }
    if (!cnhCategory) {
      Alert.alert('Campo obrigatorio', 'Selecione a categoria da CNH.');
      return false;
    }
    if (!cnhExpiry || cnhExpiry.length < 10) {
      Alert.alert('Campo obrigatorio', 'Informe a data de validade da CNH.');
      return false;
    }
    if (!experienceYears.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o tempo de habilitacao.');
      return false;
    }
    if (!workType) {
      Alert.alert('Campo obrigatorio', 'Selecione como voce atua.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!brand.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe a marca do veiculo.');
      return false;
    }
    if (!carModel.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o modelo do veiculo.');
      return false;
    }
    if (!year.trim() || year.length < 4) {
      Alert.alert('Campo obrigatorio', 'Informe o ano do veiculo.');
      return false;
    }
    if (!plate.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe a placa do veiculo.');
      return false;
    }
    if (!transmission) {
      Alert.alert('Campo obrigatorio', 'Selecione o tipo de cambio.');
      return false;
    }
    return true;
  };

  const validateStep4 = (): boolean => {
    if (!city.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe a cidade de atuacao.');
      return false;
    }
    if (!neighborhoods.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe os bairros atendidos.');
      return false;
    }
    if (!actionRadius.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o raio de atuacao.');
      return false;
    }
    if (!pricePerHour.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o valor da hora-aula.');
      return false;
    }
    const price = parseFloat(pricePerHour.replace(',', '.'));
    if (isNaN(price) || price < MINIMUM_PRICE) {
      Alert.alert('Valor invalido', `O valor minimo da hora-aula e R$ ${MINIMUM_PRICE},00.`);
      return false;
    }
    return true;
  };

  const validateStep5 = (): boolean => {
    if (!cnhFrontUploaded || !cnhBackUploaded) {
      Alert.alert('Documento obrigatorio', 'Envie a CNH (frente e verso).');
      return false;
    }
    if (!criminalRecordUploaded) {
      Alert.alert('Documento obrigatorio', 'Envie a certidao negativa de antecedentes.');
      return false;
    }
    if (!vehicleDocUploaded) {
      Alert.alert('Documento obrigatorio', 'Envie o documento do veiculo.');
      return false;
    }
    if (!vehiclePhotoUploaded) {
      Alert.alert('Documento obrigatorio', 'Envie a foto do veiculo.');
      return false;
    }
    if (!residenceProofUploaded) {
      Alert.alert('Documento obrigatorio', 'Envie o comprovante de residencia.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
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
        onComplete({
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

      <Text style={styles.label}>Numero da CNH *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o numero da CNH"
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

      <Text style={styles.label}>Tempo de habilitacao (anos) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5"
        value={experienceYears}
        onChangeText={setExperienceYears}
        keyboardType="numeric"
        maxLength={2}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Numero do registro de instrutor</Text>
      <TextInput
        style={styles.input}
        placeholder="Se aplicavel"
        value={instructorRegistration}
        onChangeText={setInstructorRegistration}
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Experiencia</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva sua experiencia como instrutor..."
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
            Autonomo
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
        <Text style={styles.sectionTitle}>Dados do Veiculo</Text>
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

      <Text style={styles.label}>Tipo de cambio *</Text>
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
            Automatico
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
        <Text style={styles.sectionTitle}>Area de Atuacao</Text>
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
        placeholder="Ex: Centro, Adrianopolis, Aleixo, Flores..."
        value={neighborhoods}
        onChangeText={setNeighborhoods}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        placeholderTextColor={Colors.light.textTertiary}
      />

      <Text style={styles.label}>Raio de atuacao (km) *</Text>
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
        Valor minimo permitido pela plataforma: R$ {MINIMUM_PRICE},00
      </Text>

      <Text style={styles.label}>Preco por hora (R$) *</Text>
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
        description="Foto legivel da frente da CNH"
        type="photo"
        uploaded={cnhFrontUploaded}
        onPress={() => handleDocumentUpload(setCnhFrontUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="CNH - Verso"
        description="Foto legivel do verso da CNH"
        type="photo"
        uploaded={cnhBackUploaded}
        onPress={() => handleDocumentUpload(setCnhBackUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Certificado de Instrutor"
        description="Se aplicavel - foto ou PDF do certificado"
        type="pdf"
        uploaded={certificateUploaded}
        onPress={() => handleDocumentUpload(setCertificateUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Certidao Negativa de Antecedentes"
        description="Documento obrigatorio"
        type="pdf"
        uploaded={criminalRecordUploaded}
        onPress={() => handleDocumentUpload(setCriminalRecordUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Documento do Veiculo (CRLV)"
        description="Foto ou PDF do documento do veiculo"
        type="pdf"
        uploaded={vehicleDocUploaded}
        onPress={() => handleDocumentUpload(setVehicleDocUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Foto do Veiculo"
        description="Foto do veiculo que sera utilizado nas aulas"
        type="photo"
        uploaded={vehiclePhotoUploaded}
        onPress={() => handleDocumentUpload(setVehiclePhotoUploaded)}
      />

      <View style={styles.docSpacer} />

      <DocumentUpload
        title="Comprovante de Residencia"
        description="Conta de luz, agua ou outro comprovante recente"
        type="pdf"
        uploaded={residenceProofUploaded}
        onPress={() => handleDocumentUpload(setResidenceProofUploaded)}
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
    3: 'Seu Veiculo',
    4: 'Area e Preco',
    5: 'Documentos',
  };

  const buttonTexts: Record<Step, string> = {
    1: 'Proximo: Dados Profissionais',
    2: 'Proximo: Veiculo',
    3: 'Proximo: Area e Preco',
    4: 'Proximo: Documentos',
    5: 'Enviar para Analise',
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
            style={[styles.nextButton, currentStep === 5 && styles.submitButton]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>{buttonTexts[currentStep]}</Text>
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
  nextButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
});
