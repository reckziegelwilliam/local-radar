import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../utils/constants';

export function EventCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { opacity: shimmerOpacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.categoryBadge, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.titleLine, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.subtitleLine, { opacity: shimmerOpacity }]} />
        <View style={styles.footer}>
          <Animated.View style={[styles.iconLine, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.iconLine, { opacity: shimmerOpacity }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: SPACING.md,
  },
  categoryBadge: {
    width: 80,
    height: 24,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  titleLine: {
    width: '80%',
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  subtitleLine: {
    width: '60%',
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconLine: {
    width: '45%',
    height: 14,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
  },
});

