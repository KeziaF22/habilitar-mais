import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SuccessIllustration from './SuccessIllustration';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  visible,
  onClose,
  title = 'Sucesso!',
  message = 'Sua ação foi concluída com sucesso.'
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Success Illustration */}
          <View style={styles.illustrationContainer}>
            <SuccessIllustration width={250} height={250} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 54, 90, 0.7)', // Navy with transparency
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  illustrationContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  closeButton: {
    backgroundColor: Colors.light.success, // Sage green
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.light.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
});
