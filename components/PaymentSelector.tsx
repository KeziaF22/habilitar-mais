import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreditCard, Smartphone } from 'lucide-react-native';
import { PaymentMethod } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

export default function PaymentSelector({ selectedMethod, onSelectMethod }: PaymentSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.paymentCard,
          selectedMethod === 'PIX' && styles.paymentCardActive,
        ]}
        onPress={() => onSelectMethod('PIX')}
      >
        <Smartphone
          size={24}
          color={selectedMethod === 'PIX' ? Colors.light.brand : Colors.light.textSecondary}
        />
        <Text
          style={[
            styles.paymentText,
            selectedMethod === 'PIX' && styles.paymentTextActive,
          ]}
        >
          PIX
        </Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-5%</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.paymentCard,
          selectedMethod === 'Cartão' && styles.paymentCardActive,
        ]}
        onPress={() => onSelectMethod('Cartão')}
      >
        <CreditCard
          size={24}
          color={selectedMethod === 'Cartão' ? Colors.light.brand : Colors.light.textSecondary}
        />
        <Text
          style={[
            styles.paymentText,
            selectedMethod === 'Cartão' && styles.paymentTextActive,
          ]}
        >
          Cartão
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
    position: 'relative',
  },
  paymentCardActive: {
    borderColor: Colors.light.brand,
    borderWidth: 2,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  paymentTextActive: {
    color: Colors.light.brand,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
