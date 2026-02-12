import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Phone, MessageCircle, Navigation } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface NextClassCardProps {
  studentName: string;
  studentAvatar?: string;
  classNumber: string; // "Aula 1/10"
  address: string;
  onCall?: () => void;
  onMessage?: () => void;
  onNavigate?: () => void;
  onStartClass?: () => void;
}

export default function NextClassCard({
  studentName,
  studentAvatar,
  classNumber,
  address,
  onCall,
  onMessage,
  onNavigate,
  onStartClass
}: NextClassCardProps) {
  return (
    <View style={styles.card}>
      {/* Student Info */}
      <View style={styles.studentInfo}>
        <View style={styles.avatarContainer}>
          {studentAvatar ? (
            <Image source={{ uri: studentAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{studentName.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.classNumber}>{classNumber}</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressContainer}>
        <View style={styles.locationIcon}>
          <View style={styles.locationDot} />
        </View>
        <Text style={styles.addressText}>{address}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCall}
          activeOpacity={0.7}
        >
          <Phone size={20} color={Colors.light.primary} strokeWidth={2.5} />
          <Text style={styles.iconButtonLabel}>Ligar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMessage}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color={Colors.light.primary} strokeWidth={2.5} />
          <Text style={styles.iconButtonLabel}>Mensagem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNavigate}
          activeOpacity={0.7}
        >
          <Navigation size={20} color={Colors.light.primary} strokeWidth={2.5} />
          <Text style={styles.iconButtonLabel}>Navegar</Text>
        </TouchableOpacity>
      </View>

      {/* Start Class Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={onStartClass}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Iniciar Aula</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  classNumber: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.infoLight,
    borderRadius: 12,
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textPrimary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 8,
  },
  iconButton: {
    alignItems: 'center',
    padding: 8,
  },
  iconButtonLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
});
