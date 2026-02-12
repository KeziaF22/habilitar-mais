import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import { useAuth, Instructor } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { StudentStackParamList } from '@/navigation/types';
import InstructorCard from '@/components/InstructorCard';
import EmptyState from '@/components/EmptyState';
import Logo from '@/components/Logo';

// Only import map on native platforms
let InstructorMapbox: any = null;
if (Platform.OS !== 'web') {
  InstructorMapbox = require('@/components/InstructorMapbox').default;
}

type Props = NativeStackScreenProps<StudentStackParamList, 'StudentHome'>;
type Filter = 'All' | 'Manual' | 'Auto';

export default function StudentHomeScreen({ navigation }: Props) {
  const { instructors } = useAuth();
  const [filter, setFilter] = useState<Filter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const filteredInstructors = useMemo(() => {
    let result = instructors;

    if (searchQuery) {
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter !== 'All') {
      result = result.filter((i) => i.transmission === filter);
    }

    if (priceFilter) {
      result = result.filter((i) => i.pricePerHour <= priceFilter);
    }

    return result;
  }, [searchQuery, filter, priceFilter, instructors]);

  const renderInstructorCard = ({ item }: { item: Instructor }) => (
    <InstructorCard
      instructor={item}
      onPress={() => navigation.navigate('InstructorDetail', { id: item.id })}
    />
  );

  const clearFilters = () => {
    setFilter('All');
    setPriceFilter(null);
    setSearchQuery('');
  };

  const renderEmptyState = () => (
    <EmptyState
      title="Nenhum instrutor encontrado"
      message="Não encontramos instrutores que correspondam aos seus filtros. Tente ajustar a busca ou limpar os filtros."
      buttonText="Limpar Filtros"
      onButtonPress={clearFilters}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Logo width={160} height={50} />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Encontre seu Instrutor Ideal</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, bairro..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        {/* Map - Only on mobile platforms */}
        {Platform.OS !== 'web' && InstructorMapbox && (
          <View style={styles.mapContainer}>
            <InstructorMapbox
              instructors={filteredInstructors}
              selectedInstructorId={selectedInstructorId}
              onInstructorPress={(id: string) => setSelectedInstructorId(id)}
            />
          </View>
        )}

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filtersContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'All' && styles.filterButtonActive]}
              onPress={() => setFilter('All')}
            >
              <Text style={[styles.filterButtonText, filter === 'All' && styles.filterButtonTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'Manual' && styles.filterButtonActive]}
              onPress={() => setFilter('Manual')}
            >
              <Text style={[styles.filterButtonText, filter === 'Manual' && styles.filterButtonTextActive]}>
                Manual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'Auto' && styles.filterButtonActive]}
              onPress={() => setFilter('Auto')}
            >
              <Text style={[styles.filterButtonText, filter === 'Auto' && styles.filterButtonTextActive]}>
                Automático
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 60 && styles.filterButtonActive]}
              onPress={() => setPriceFilter(priceFilter === 60 ? null : 60)}
            >
              <Text
                style={[styles.filterButtonText, priceFilter === 60 && styles.filterButtonTextActive]}
              >
                Até R$ 60/h
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 80 && styles.filterButtonActive]}
              onPress={() => setPriceFilter(priceFilter === 80 ? null : 80)}
            >
              <Text
                style={[styles.filterButtonText, priceFilter === 80 && styles.filterButtonTextActive]}
              >
                Até R$ 80/h
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 100 && styles.filterButtonActive]}
              onPress={() => setPriceFilter(priceFilter === 100 ? null : 100)}
            >
              <Text
                style={[styles.filterButtonText, priceFilter === 100 && styles.filterButtonTextActive]}
              >
                Até R$ 100/h
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Instructors List */}
        <FlatList
          data={filteredInstructors}
          renderItem={renderInstructorCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.brand,
  },
  banner: {
    backgroundColor: Colors.light.brand,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.brandContainer,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.textPrimary,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  filtersScroll: {
    marginTop: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.brand,
    borderColor: Colors.light.brand,
  },
  filterButtonText: {
    color: Colors.light.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: Colors.light.surface,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
});
