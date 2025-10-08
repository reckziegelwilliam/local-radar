import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
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

  return (
    <Marker
      coordinate={{
        latitude: event.latitude,
        longitude: event.longitude,
      }}
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
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});
