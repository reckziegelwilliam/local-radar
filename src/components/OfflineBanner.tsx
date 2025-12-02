import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const [isDismissed, setIsDismissed] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (isOffline && !isDismissed) {
      // Show banner
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // Hide banner
      Animated.spring(slideAnim, {
        toValue: -100,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }

    // Reset dismissed state when back online
    if (!isOffline) {
      setIsDismissed(false);
    }
  }, [isOffline, isDismissed, slideAnim]);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents={isOffline && !isDismissed ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.text}>No internet connection</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFC107',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    paddingTop: SPACING.xl + 10, // Account for status bar
  },
  icon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  text: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
  },
  dismissButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 24,
    color: COLORS.text.primary,
    fontWeight: '300',
  },
});

