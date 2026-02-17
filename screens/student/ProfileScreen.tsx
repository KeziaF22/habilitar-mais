import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Edit2, Home, LogOut, Mail, MapPin, Phone, Star, Trash2, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const {
    currentStudent,
    updateStudentInfo,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    appointments,
    instructors,
    favoriteInstructorIds,
    logout,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentStudent.name);
  const [editedEmail, setEditedEmail] = useState(currentStudent.email || '');
  const [editedPhone, setEditedPhone] = useState(currentStudent.phone || '');

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');

  const handleSaveProfile = () => {
    updateStudentInfo({
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    });
    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditedName(currentStudent.name);
    setEditedEmail(currentStudent.email || '');
    setEditedPhone(currentStudent.phone || '');
    setIsEditing(false);
  };

  const handleRemoveAddress = (id: string) => {
    Alert.alert(
      'Remover Endereço',
      'Tem certeza que deseja remover este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removeSavedAddress(id),
        },
      ]
    );
  };

  const handleAddAddress = () => {
    const label = newLabel.trim();
    const street = newStreet.trim();
    const neighborhood = newNeighborhood.trim();

    if (!label || !street || !neighborhood) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para salvar o endereço.');
      return;
    }

    addSavedAddress({ label, street, neighborhood });
    setNewLabel('');
    setNewStreet('');
    setNewNeighborhood('');
    setShowAddAddress(false);
    Alert.alert('Sucesso', 'Endereço adicionado com sucesso!');
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

  const statistics = useMemo(() => {
    const myAppointments = appointments.filter(
      (apt) => apt.studentId === currentStudent.id && apt.status === 'Aceita'
    );
    const totalClasses = myAppointments.length;
    const totalHours = totalClasses * 0.83; // ~50 min per class

    // Find most frequent instructor
    const instructorCounts: Record<string, number> = {};
    myAppointments.forEach((apt) => {
      instructorCounts[apt.instructorId] = (instructorCounts[apt.instructorId] || 0) + 1;
    });

    const favoriteInstructorId = Object.entries(instructorCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    const favoriteInstructor = favoriteInstructorId
      ? instructors.find((inst) => inst.id === favoriteInstructorId)
      : null;

    return {
      totalClasses,
      totalHours,
      favoriteInstructor,
    };
  }, [appointments, currentStudent.id, instructors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={48} color={Colors.light.surface} />
          </View>
        </View>

        {!isEditing ? (
          <>
            <Text style={styles.name}>{currentStudent.name}</Text>
            {currentStudent.email && <Text style={styles.email}>{currentStudent.email}</Text>}
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Edit2 size={16} color={Colors.light.brand} />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.editContainer}>
            <View style={styles.inputGroup}>
              <User size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nome"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Mail size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Phone size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Telefone"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Calendar size={28} color={Colors.light.brand} />
            <Text style={styles.statValue}>{statistics.totalClasses}</Text>
            <Text style={styles.statLabel}>Aulas Realizadas</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={28} color={Colors.light.warning} />
            <Text style={styles.statValue}>{statistics.totalHours.toFixed(1)}h</Text>
            <Text style={styles.statLabel}>Horas de Prática</Text>
          </View>
        </View>

        {statistics.favoriteInstructor && (
          <View style={styles.favoriteInstructorCard}>
            <Text style={styles.favoriteLabel}>Instrutor Favorito</Text>
            <Text style={styles.favoriteInstructorName}>
              {statistics.favoriteInstructor.name}
            </Text>
          </View>
        )}
      </View>

      {/* Saved Addresses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Endereços Salvos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddAddress(true)}
          >
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {savedAddresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <MapPin size={20} color={Colors.light.brand} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{address.label}</Text>
              <Text style={styles.addressStreet}>
                {address.street}, {address.neighborhood}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveAddress(address.id)}>
              <Trash2 size={20} color={Colors.light.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.light.error} />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>

      {/* Add Address Modal */}
      <Modal
        visible={showAddAddress}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddAddress(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowAddAddress(false)}
          />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddAddress(false)}>
                <ArrowLeft size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Novo Endereço</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.modalForm}>
              <View style={styles.modalInputGroup}>
                <Home size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.modalInput}
                  value={newLabel}
                  onChangeText={setNewLabel}
                  placeholder="Apelido (ex: Casa, Trabalho)"
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <MapPin size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.modalInput}
                  value={newStreet}
                  onChangeText={setNewStreet}
                  placeholder="Rua / Endereço"
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <MapPin size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.modalInput}
                  value={newNeighborhood}
                  onChangeText={setNewNeighborhood}
                  placeholder="Bairro"
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddAddress}>
              <Text style={styles.modalSaveButtonText}>Salvar Endereço</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.brand,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.brand,
  },
  editContainer: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.brand,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surface,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.light.brand,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surface,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  favoriteInstructorCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  favoriteInstructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.brand,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  addressStreet: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.light.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.error,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  modalForm: {
    gap: 12,
    marginBottom: 24,
  },
  modalInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  modalSaveButton: {
    backgroundColor: Colors.light.brand,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
});
