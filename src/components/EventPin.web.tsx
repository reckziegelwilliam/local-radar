import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../types';
import { CATEGORIES, COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../utils/constants';

interface EventPinProps {
  event: Event;
  onPress?: (event: Event) => void;
}

export function EventPin({ event, onPress }: EventPinProps) {
  const category = CATEGORIES.find(cat => cat.id === event.category);
  const emoji = category?.emoji || '📍';
  const color = category?.color || COLORS.secondary;

  // For web, we'll render a simple card-like component instead of a map marker
  return (
    <TouchableOpacity
      style={styles.webContainer}
      onPress={() => onPress?.(event)}
    >
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={styles.emoji}>{emoji}</Text>
        {event.rsvp_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{event.rsvp_count}</Text>
          </View>
        )}
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.category}>{category?.label || 'Other'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
});
