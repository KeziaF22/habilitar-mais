import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Colors from '@/constants/Colors';

interface DaySelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DaySelector({ selectedDate, onSelectDate }: DaySelectorProps) {
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      result.push(addDays(new Date(), i));
    }
    return result;
  }, []);

  const renderDay = ({ item }: { item: Date }) => {
    const isSelected =
      format(item, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

    return (
      <TouchableOpacity
        style={[styles.dayCard, isSelected && styles.dayCardActive]}
        onPress={() => onSelectDate(item)}
      >
        <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
          {format(item, 'EEE', { locale: ptBR })}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.dayNumberActive]}>
          {format(item, 'd')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={days}
      renderItem={renderDay}
      keyExtractor={(item) => item.toISOString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  dayCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.light.background,
    minWidth: 70,
  },
  dayCardActive: {
    backgroundColor: Colors.light.brand,
    borderColor: Colors.light.brand,
  },
  dayText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dayTextActive: {
    color: Colors.light.surface,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 4,
  },
  dayNumberActive: {
    color: Colors.light.surface,
  },
});
