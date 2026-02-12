import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

interface TimeGridProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  availableTimes: string[];
}

export default function TimeGrid({ selectedTime, onSelectTime, availableTimes }: TimeGridProps) {
  const renderTime = ({ item }: { item: string }) => {
    const isSelected = selectedTime === item;

    return (
      <TouchableOpacity
        style={[styles.timeCard, isSelected && styles.timeCardActive]}
        onPress={() => onSelectTime(item)}
      >
        <Text style={[styles.timeText, isSelected && styles.timeTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={availableTimes}
      renderItem={renderTime}
      keyExtractor={(item) => item}
      numColumns={3}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  timeCardActive: {
    backgroundColor: Colors.light.brand,
    borderColor: Colors.light.brand,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  timeTextActive: {
    color: Colors.light.surface,
  },
});
