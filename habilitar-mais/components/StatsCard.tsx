import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  subtitle?: string;
  progress?: number; // 0-1 for progress bar (optional)
}

export default function StatsCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  subtitle,
  progress
}: StatsCardProps) {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon size={28} color={iconColor} strokeWidth={2} />
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Value */}
      <Text style={styles.value}>{value}</Text>

      {/* Subtitle (optional) */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {/* Progress bar (optional) */}
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 110,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
  },
  progressBackground: {
    height: 4,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
});
