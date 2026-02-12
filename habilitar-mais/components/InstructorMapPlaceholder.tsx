import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Instructor } from '@/context/AuthContext';

interface InstructorMapPlaceholderProps {
  instructors: Instructor[];
  onInstructorPress?: (id: string) => void;
  selectedInstructorId?: string | null;
}

export default function InstructorMapPlaceholder({
  instructors,
  onInstructorPress,
  selectedInstructorId,
}: InstructorMapPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MapPin size={48} color={Colors.light.primary} />
        <Text style={styles.title}>Mapa Interativo</Text>
        <Text style={styles.subtitle}>
          {instructors.length} instrutor{instructors.length !== 1 ? 'es' : ''} próximo{instructors.length !== 1 ? 's' : ''} a você
        </Text>
        <Text style={styles.note}>
          Configure o Mapbox para ver o mapa completo com preços
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
    backgroundColor: Colors.light.surfaceVariant,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
