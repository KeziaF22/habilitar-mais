import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface DailyChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
}

export default function DailyChecklist({ items, onToggleItem }: DailyChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconBadge}>
            <CheckCircle2 size={20} color={Colors.light.primary} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Checklist Diário</Text>
        </View>
        <Text style={styles.counter}>
          {completedCount}/{totalCount}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Checklist Items */}
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checklistItem}
            onPress={() => onToggleItem(item.id)}
            activeOpacity={0.7}
          >
            {item.completed ? (
              <CheckCircle2
                size={24}
                color={Colors.light.success}
                strokeWidth={2.5}
              />
            ) : (
              <Circle
                size={24}
                color={Colors.light.border}
                strokeWidth={2}
              />
            )}
            <Text
              style={[
                styles.checklistLabel,
                item.completed && styles.checklistLabelCompleted
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.light.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 6,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 3,
  },
  itemsContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checklistLabel: {
    fontSize: 15,
    color: Colors.light.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  checklistLabelCompleted: {
    color: Colors.light.textSecondary,
    textDecorationLine: 'line-through',
  },
});
