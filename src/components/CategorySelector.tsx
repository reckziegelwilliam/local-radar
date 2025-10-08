import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CATEGORIES, COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../utils/constants';
import { CategoryId } from '../types';

interface CategorySelectorProps {
  selectedCategory: CategoryId | null;
  onSelectCategory: (category: CategoryId) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                { backgroundColor: isSelected ? category.color : COLORS.surface },
                isSelected && styles.selectedCategory,
              ]}
              onPress={() => onSelectCategory(category.id as CategoryId)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text
                style={[
                  styles.categoryText,
                  { color: isSelected ? COLORS.text.inverse : COLORS.text.primary },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingRight: SPACING.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
  },
  selectedCategory: {
    borderColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  emoji: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
  },
});
