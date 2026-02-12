import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Edit2, LogOut, Mail, MapPin, Phone, Star, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function InstructorProfileScreen() {
  const { currentInstructor, logout, updateInstructorInfo } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentInstructor?.name || '');
  const [editedBio, setEditedBio] = useState(currentInstructor?.bio || '');

  if (!currentInstructor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar perfil do instrutor.</Text>
      </View>
    );
  }

  const handleSaveProfile = () => {
    updateInstructorInfo({ name: editedName, bio: editedBio });
    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditedName(currentInstructor.name);
    setEditedBio(currentInstructor.bio);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Header with Cover and Profile Image */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: currentInstructor.coverImage }} style={styles.coverImage} />
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: currentInstructor.profileImage }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          {isEditing ? (
            <View>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nome completo"
              />
            </View>
          ) : (
            <View style={styles.infoRow}>
              <User size={20} color={Colors.light.brand} />
              <Text style={styles.infoText}>{currentInstructor.name}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <MapPin size={20} color={Colors.light.brand} />
            <Text style={styles.infoText}>{currentInstructor.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Star size={20} color={Colors.light.warning} fill={Colors.light.warning} />
            <Text style={styles.infoText}>
              {currentInstructor.rating.toFixed(1)} ({currentInstructor.reviews.length} avaliações)
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veículo</Text>
          <View style={styles.vehicleCard}>
            <Car size={24} color={Colors.light.brand} />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleText}>{currentInstructor.car}</Text>
              <Text style={styles.transmissionText}>
                {currentInstructor.transmission === 'Auto' ? 'Automático' : 'Manual'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mim</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editedBio}
              onChangeText={setEditedBio}
              placeholder="Conte um pouco sobre você..."
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.bioText}>{currentInstructor.bio}</Text>
          )}
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {currentInstructor.specialties.map((specialty) => (
              <View key={specialty} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço</Text>
          <Text style={styles.priceText}>R$ {currentInstructor.pricePerHour.toFixed(0)}/hora</Text>
        </View>

        {/* Edit/Save Buttons */}
        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Edit2 size={20} color={Colors.light.surface} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  coverImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
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
  content: {
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.light.error,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.light.textPrimary,
    borderWidth: 1,
    borderColor: Colors.light.brandContainer,
    marginBottom: 12,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    flex: 1,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.brandContainer,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  transmissionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  bioText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.brand,
    textAlign: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.textSecondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.brand,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.brand,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.error,
  },
});
