import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Car, Heart, MapPin, Star } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { StudentStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<StudentStackParamList, 'InstructorDetail'>;

export default function InstructorDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { instructors, favoriteInstructorIds, toggleFavorite } = useAuth();

  const instructor = instructors.find((inst) => inst.id === id);

  if (!instructor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Instrutor não encontrado.</Text>
      </View>
    );
  }

  const transmissionLabel = instructor.transmission === 'Auto' ? 'Automático' : 'Manual';
  const isFavorite = favoriteInstructorIds.includes(instructor.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cover + Profile Image */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: instructor.coverImage }} style={styles.coverImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(instructor.id)}
        >
          <Heart
            size={24}
            color={isFavorite ? Colors.light.error : Colors.light.surface}
            fill={isFavorite ? Colors.light.error : 'transparent'}
          />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: instructor.profileImage }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.contentPadding}>
        {/* Name and Basic Info */}
        <Text style={styles.instructorName}>{instructor.name}</Text>

        <View style={styles.centerRow}>
          <Star size={18} color={Colors.light.warning} fill={Colors.light.warning} />
          <Text style={styles.ratingText}>
            {instructor.rating.toFixed(1)} ({instructor.reviews.length} avaliações)
          </Text>
        </View>

        {instructor.isAvailable && (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Disponível Agora</Text>
          </View>
        )}

        <View style={styles.centerRow}>
          <MapPin size={18} color={Colors.light.textSecondary} />
          <Text style={styles.locationText}>{instructor.location}</Text>
        </View>

        <Text style={styles.priceText}>R$ {instructor.pricePerHour.toFixed(0)}/hora</Text>

        {/* Vehicle Info */}
        <View style={styles.vehicleRow}>
          <Car size={20} color={Colors.light.brand} />
          <Text style={styles.vehicleText}>
            {instructor.car} ({transmissionLabel})
          </Text>
        </View>

        {/* Specialties */}
        <Text style={styles.sectionTitle}>Especialidades</Text>
        <View style={styles.specialtiesContainer}>
          {instructor.specialties.map((specialty) => (
            <View key={specialty} style={styles.specialtyChip}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>Sobre o Instrutor</Text>
        <Text style={styles.bioText}>{instructor.bio}</Text>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Avaliações</Text>
        {instructor.reviews.length > 0 ? (
          instructor.reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>
                    {review.student.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewStudent}>{review.student}</Text>
                  <View style={styles.reviewRating}>
                    <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviewsText}>Nenhuma avaliação ainda.</Text>
        )}

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('StudentCheckout', { instructorId: instructor.id })}
        >
          <Text style={styles.requestButtonText}>Confirmar Reserva</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentPadding: {
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.light.error,
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 50,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 60,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  instructorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.brandContainer,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 8,
    gap: 6,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  availableText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.brand,
  },
  locationText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.brand,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  vehicleText: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  specialtyChip: {
    backgroundColor: Colors.light.brandContainer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.light.brand,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.brand,
    letterSpacing: 0.2,
  },
  bioText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  reviewCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  reviewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reviewStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  reviewComment: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  noReviewsText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  requestButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
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
