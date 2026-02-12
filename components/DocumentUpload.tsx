import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, FileText, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DocumentUploadProps {
  title: string;
  description: string;
  type: 'photo' | 'pdf';
  uploaded?: boolean;
  onPress: () => void;
}

export default function DocumentUpload({
  title,
  description,
  type,
  uploaded = false,
  onPress
}: DocumentUploadProps) {
  const Icon = type === 'photo' ? Camera : FileText;

  return (
    <TouchableOpacity
      style={[styles.container, uploaded && styles.containerUploaded]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, uploaded && styles.iconContainerUploaded]}>
        <Icon
          size={32}
          color={uploaded ? Colors.light.success : Colors.light.primary}
          strokeWidth={2}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Action Button */}
      <View style={styles.actionButton}>
        <Plus size={16} color={Colors.light.primary} strokeWidth={3} />
        <Text style={styles.actionButtonText}>
          {uploaded ? 'Alterar documento' : 'Toque para adicionar'}
        </Text>
      </View>

      {/* Uploaded indicator */}
      {uploaded && (
        <View style={styles.uploadedBadge}>
          <Text style={styles.uploadedBadgeText}>✓ Enviado</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  containerUploaded: {
    borderColor: Colors.light.success,
    borderStyle: 'solid',
    backgroundColor: Colors.light.successLight,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.light.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainerUploaded: {
    backgroundColor: Colors.light.successLight,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  uploadedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  uploadedBadgeText: {
    fontSize: 12,
    color: Colors.light.surface,
    fontWeight: 'bold',
  },
});
