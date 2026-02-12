import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectList } from 'react-native-dropdown-select-list';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/ProgressBar';
import DocumentUpload from '@/components/DocumentUpload';

type Step = 1 | 2 | 3;

export default function InstructorSignupScreen() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 - Personal Data
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [hasEAR, setHasEAR] = useState(true);

  // Step 2 - Vehicle
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [transmission, setTransmission] = useState<'Manual' | 'Automático' | null>(null);
  const [hasAC, setHasAC] = useState(false);
  const [hasPowerSteering, setHasPowerSteering] = useState(false);
  const [hasDualControls, setHasDualControls] = useState(false);

  // Step 3 - Documents
  const [cnhUploaded, setCnhUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);

  const carModels = [
    { key: '1', value: 'Honda Fit' },
    { key: '2', value: 'Toyota Corolla' },
    { key: '3', value: 'Volkswagen Gol' },
    { key: '4', value: 'Chevrolet Onix' },
    { key: '5', value: 'Fiat Argo' },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName || !cpf || !cnh) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!carModel || !year || !transmission) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!cnhUploaded || !certificateUploaded) {
        Alert.alert('Erro', 'Por favor, envie todos os documentos obrigatórios.');
        return;
      }
      Alert.alert(
        'Sucesso!',
        'Documentos enviados para análise. Você receberá um retorno em até 48 horas.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleDocumentUpload = (docType: 'cnh' | 'certificate') => {
    Alert.alert(
      'Upload de Documento',
      'Funcionalidade de upload será implementada. Por enquanto, marcando como enviado.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (docType === 'cnh') setCnhUploaded(true);
            else setCertificateUploaded(true);
          }
        }
      ]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={Colors.light.textTertiary}
            />

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              placeholderTextColor={Colors.light.textTertiary}
            />

            <Text style={styles.label}>Número da CNH</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o número da CNH"
              value={cnh}
              onChangeText={setCnh}
              keyboardType="numeric"
              placeholderTextColor={Colors.light.textTertiary}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Possui EAR (Exerce Atividade Remunerada)?</Text>
              <Switch
                value={hasEAR}
                onValueChange={setHasEAR}
                trackColor={{ false: Colors.light.border, true: Colors.light.success }}
                thumbColor={Colors.light.surface}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Modelo do Carro</Text>
            <SelectList
              setSelected={(val: string) => {
                const selected = carModels.find(m => m.key === val);
                setCarModel(selected?.value || '');
              }}
              data={carModels}
              save="key"
              placeholder="Selecione (ex: Honda Fit)"
              search={false}
              boxStyles={styles.selectBox}
              dropdownStyles={styles.selectDropdown}
              inputStyles={styles.selectInput}
            />

            <Text style={styles.label}>Ano de Fabricação</Text>
            <TextInput
              style={styles.input}
              placeholder="2020"
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={Colors.light.textTertiary}
            />

            <Text style={styles.label}>Transmissão</Text>
            <View style={styles.transmissionButtons}>
              <TouchableOpacity
                style={[
                  styles.transmissionButton,
                  transmission === 'Manual' && styles.transmissionButtonActive
                ]}
                onPress={() => setTransmission('Manual')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'Manual' && styles.transmissionButtonTextActive
                  ]}
                >
                  ⚙️ Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.transmissionButton,
                  transmission === 'Automático' && styles.transmissionButtonActive
                ]}
                onPress={() => setTransmission('Automático')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'Automático' && styles.transmissionButtonTextActive
                  ]}
                >
                  A Automático
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Itens de Segurança</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasAC(!hasAC)}
              >
                <View style={[styles.checkboxBox, hasAC && styles.checkboxBoxChecked]}>
                  {hasAC && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Ar Condicionado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasPowerSteering(!hasPowerSteering)}
              >
                <View style={[styles.checkboxBox, hasPowerSteering && styles.checkboxBoxChecked]}>
                  {hasPowerSteering && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Direção Hidráulica/Elétrica</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setHasDualControls(!hasDualControls)}
              >
                <View style={[styles.checkboxBox, hasDualControls && styles.checkboxBoxChecked]}>
                  {hasDualControls && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Duplo Comando (Pedais auxiliares)</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <DocumentUpload
              title="Foto da CNH Aberta (Com EAR)"
              description="Frente e Verso legíveis"
              type="photo"
              uploaded={cnhUploaded}
              onPress={() => handleDocumentUpload('cnh')}
            />

            <View style={{ height: 20 }} />

            <DocumentUpload
              title="Certificado de Curso de Instrutor"
              description="Foto ou PDF do certificado válido"
              type="pdf"
              uploaded={certificateUploaded}
              onPress={() => handleDocumentUpload('certificate')}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Torne-se um Instrutor';
      case 2:
        return 'Seu Veículo';
      case 3:
        return 'Envie seus Documentos';
      default:
        return '';
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return 'Próximo: Veículo';
      case 2:
        return 'Próximo: Documentos';
      case 3:
        return 'Enviar para Análise';
      default:
        return 'Próximo';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <Text style={styles.stepIndicator}>{currentStep}/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar currentStep={currentStep} totalSteps={3} />
      </View>

      {/* Step Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentStep === 3 && styles.submitButton
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
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
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContent: {
    gap: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 8,
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
  selectBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingVertical: 14,
  },
  selectDropdown: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderWidth: 1.5,
    borderRadius: 12,
    marginTop: 4,
  },
  selectInput: {
    color: Colors.light.textPrimary,
    fontSize: 16,
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
  checkboxContainer: {
    gap: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  checkboxCheck: {
    color: Colors.light.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    flex: 1,
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
