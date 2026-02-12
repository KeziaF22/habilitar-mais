import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import EmptyStateIllustration from './EmptyStateIllustration';

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function EmptyState({
  title = 'Nenhum instrutor encontrado',
  message = 'Tente ajustar os filtros ou realizar uma nova busca para encontrar instrutores disponíveis.',
  buttonText = 'Limpar Filtros',
  onButtonPress
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Empty State Illustration */}
      <EmptyStateIllustration width={250} height={250} />

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Action Button (optional) */}
      {onButtonPress && (
        <TouchableOpacity
          style={styles.button}
          onPress={onButtonPress}
          activeOpacity={0.8}
        >
          <RefreshCw size={20} color={Colors.light.surface} strokeWidth={2.5} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.brandContainer,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
});
