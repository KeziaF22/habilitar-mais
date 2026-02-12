import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAuth, PaymentMethod } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { StudentStackParamList } from '@/navigation/types';
import DaySelector from '@/components/DaySelector';
import TimeGrid from '@/components/TimeGrid';
import PaymentSelector from '@/components/PaymentSelector';
import SuccessModal from '@/components/SuccessModal';

type Props = NativeStackScreenProps<StudentStackParamList, 'StudentCheckout'>;

export default function StudentCheckoutScreen({ navigation, route }: Props) {
  const { instructorId } = route.params;
  const { instructors, addAppointment, currentStudent, savedAddresses } = useAuth();

  const instructor = instructors.find((inst) => inst.id === instructorId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  const formattedAddresses = savedAddresses.map((addr) => ({
    key: addr.id,
    value: `${addr.street} (${addr.label})`,
  }));

  const selectedAddress = savedAddresses.find((addr) => addr.id === selectedAddressId);

  const { basePrice, serviceFee, subtotal, discount, total } = useMemo(() => {
    if (!instructor) return { basePrice: 0, serviceFee: 0, subtotal: 0, discount: 0, total: 0 };

    const base = instructor.pricePerHour;
    const fee = 5.0;
    const sub = base + fee;
    const disc = paymentMethod === 'PIX' ? sub * 0.05 : 0;
    const tot = sub - disc;

    return {
      basePrice: base,
      serviceFee: fee,
      subtotal: sub,
      discount: disc,
      total: tot,
    };
  }, [instructor, paymentMethod]);

  const handleRequestClass = () => {
    if (!instructor || !selectedDate || !selectedTime || !selectedAddress || !paymentMethod) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para solicitar a aula.');
      return;
    }

    const newAppointment = {
      studentId: currentStudent.id,
      instructorId: instructor.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      location: `${selectedAddress.street}, ${selectedAddress.neighborhood}`,
      price: basePrice,
      address: `${selectedAddress.street}, ${selectedAddress.neighborhood}`,
      paymentMethod: paymentMethod,
      serviceFee: serviceFee,
      discount: discount,
      totalPrice: total,
    };

    addAppointment(newAppointment);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.popToTop();
  };

  if (!instructor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Instrutor não encontrado para agendamento.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Confirmar Reserva</Text>
      <Text style={styles.subheader}>Aula com {instructor.name}</Text>

      {/* Date Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quando será a aula?</Text>
        <DaySelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {/* Time Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Que horas?</Text>
        <TimeGrid
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          availableTimes={availableTimes}
        />
      </View>

      {/* Address Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Onde eu te busco?</Text>
        <SelectList
          setSelected={(val: string) => setSelectedAddressId(val)}
          data={formattedAddresses}
          save="key"
          placeholder="Selecione o endereço"
          search={false}
          boxStyles={styles.selectListBox}
          dropdownStyles={styles.selectListDropdown}
          inputStyles={styles.selectListInput}
          maxHeight={150}
        />
        <Text style={styles.note}>💡 O instrutor irá até este local</Text>
      </View>

      {/* Payment Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pagamento</Text>
        <PaymentSelector selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
      </View>

      {/* Price Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Aula (50min)</Text>
          <Text style={styles.summaryValue}>R$ {basePrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxa de Serviço</Text>
          <Text style={styles.summaryValue}>R$ {serviceFee.toFixed(2)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>Desconto PIX (-5%)</Text>
            <Text style={styles.discountValue}>-R$ {discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.requestButton} onPress={handleRequestClass}>
        <Text style={styles.requestButtonText}>Confirmar e Pagar</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Reserva Confirmada! 🎉"
        message={`Sua aula com ${instructor?.name} foi agendada com sucesso! O instrutor receberá sua solicitação em breve.`}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 24,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.light.error,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: Colors.light.textPrimary,
    marginBottom: 12,
    fontWeight: '700',
  },
  selectListBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.background,
    paddingVertical: 2,
  },
  selectListDropdown: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.background,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  selectListInput: {
    color: Colors.light.textPrimary,
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  summary: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },
  discountLabel: {
    fontSize: 16,
    color: Colors.light.success,
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 16,
    color: Colors.light.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.background,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 20,
    color: Colors.light.textPrimary,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 24,
    color: Colors.light.brand,
    fontWeight: 'bold',
  },
  requestButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  requestButtonText: {
    color: Colors.light.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
