import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { Instructor } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

interface InstructorCardProps {
  instructor: Instructor;
  onPress: () => void;
}

export default function InstructorCard({ instructor, onPress }: InstructorCardProps) {
  const transmissionLabel = instructor.transmission === 'Auto' ? 'Automático' : 'Manual';
  const categoryLabel = 'Carro'; // Pode ser expandido depois para Moto, etc

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header com foto e preço */}
      <View style={styles.header}>
        <Image source={{ uri: instructor.profileImage }} style={styles.profileImage} />

        <View style={styles.content}>
          {/* Nome */}
          <Text style={styles.name} numberOfLines={1}>{instructor.name}</Text>

          {/* Categoria + Transmissão */}
          <Text style={styles.category}>
            {categoryLabel} • {transmissionLabel}
          </Text>

          {/* Localização */}
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.light.textSecondary} />
            <Text style={styles.location}>{instructor.location}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
            <Text style={styles.rating}>{instructor.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Preço no canto direito */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ {instructor.pricePerHour.toFixed(0)}/h</Text>
        </View>
      </View>

      {/* Descrição curta */}
      {instructor.bio && (
        <Text style={styles.description} numberOfLines={2}>
          {instructor.bio}
        </Text>
      )}

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.buttonText}>Agendar Aula</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.success,
  },
  description: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.light.success,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.surface,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
