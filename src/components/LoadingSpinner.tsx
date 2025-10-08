import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  text = 'Loading...', 
  size = 'large', 
  color = COLORS.primary 
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
