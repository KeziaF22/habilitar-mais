import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showPercentage?: boolean;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  showPercentage = true
}: ProgressBarProps) {
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>{percentage}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 8,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    minWidth: 40,
    textAlign: 'right',
  },
});
