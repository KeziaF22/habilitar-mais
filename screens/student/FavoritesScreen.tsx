import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { StudentStackParamList } from '@/navigation/types';
import InstructorCard from '@/components/InstructorCard';

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { instructors, favoriteInstructorIds } = useAuth();

  const favoriteInstructors = useMemo(() => {
    return instructors.filter((instructor) => favoriteInstructorIds.includes(instructor.id));
  }, [instructors, favoriteInstructorIds]);

  const renderInstructor = ({ item }: { item: typeof instructors[0] }) => (
    <InstructorCard
      instructor={item}
      onPress={() => navigation.navigate('InstructorDetail', { id: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>{favoriteInstructors.length} instrutores</Text>
      </View>

      {/* Favorites List */}
      {favoriteInstructors.length > 0 ? (
        <FlatList
          data={favoriteInstructors}
          renderItem={renderInstructor}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={Colors.light.textSecondary} />
          <Text style={styles.emptyTitle}>Você ainda não tem favoritos</Text>
          <Text style={styles.emptySubtitle}>
            Toque no ícone de coração nos perfis dos instrutores para salvá-los aqui
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('StudentHome')}
          >
            <Text style={styles.exploreButtonText}>Explorar Instrutores</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: Colors.light.brand,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  exploreButtonText: {
    color: Colors.light.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
