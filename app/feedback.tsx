import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FeedbackService } from '../src/services/FeedbackService';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../src/utils/constants';

type FeedbackType = 'bug' | 'feature' | 'general';

export default function FeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const preselectedType = params.type as FeedbackType | undefined;

  const [feedbackType, setFeedbackType] = useState<FeedbackType>(preselectedType || 'general');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const feedbackTypes: Array<{ id: FeedbackType; label: string; emoji: string; description: string }> = [
    { id: 'bug', label: 'Bug Report', emoji: '🐛', description: 'Something is broken or not working' },
    { id: 'feature', label: 'Feature Request', emoji: '💡', description: 'Suggest a new feature or improvement' },
    { id: 'general', label: 'General Feedback', emoji: '💬', description: 'Share your thoughts or ideas' },
  ];

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Missing Feedback', 'Please enter your feedback before submitting.');
      return;
    }

    if (feedback.trim().length < 10) {
      Alert.alert('Too Short', 'Please provide at least 10 characters of feedback.');
      return;
    }

    setLoading(true);

    try {
      const result = await FeedbackService.submitFeedback({
        feedback: feedback.trim(),
        feedbackType,
        screenName: 'FeedbackScreen',
      });

      if (result.success) {
        Alert.alert(
          'Thank You!',
          'Your feedback has been submitted. We appreciate your help in making Buzzy better!',
          [
            {
              text: 'OK',
              onPress: () => {
                setFeedback('');
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Beta Feedback</Text>
            <Text style={styles.subtitle}>
              Help us improve Buzzy! Your feedback is valuable to us.
            </Text>
          </View>

          {/* Feedback Type Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>What type of feedback?</Text>
            <View style={styles.typeGrid}>
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    feedbackType === type.id && styles.typeCardActive,
                  ]}
                  onPress={() => setFeedbackType(type.id)}
                  disabled={loading}
                >
                  <Text style={styles.typeEmoji}>{type.emoji}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      feedbackType === type.id && styles.typeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Feedback Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Feedback</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tell us what's on your mind..."
              placeholderTextColor={COLORS.text.secondary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              editable={!loading}
              maxLength={5000}
            />
            <Text style={styles.charCount}>
              {feedback.length} / 5000 characters
            </Text>
          </View>

          {/* Tips */}
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>💡 Tips for great feedback:</Text>
            <Text style={styles.tipText}>• Be specific about what happened</Text>
            <Text style={styles.tipText}>• Include steps to reproduce bugs</Text>
            <Text style={styles.tipText}>• Describe expected vs actual behavior</Text>
            <Text style={styles.tipText}>• Mention the screen or feature involved</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Text>
          </TouchableOpacity>

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>
            Your feedback includes device information to help us debug issues.
            We never share your personal information.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  typeGrid: {
    gap: SPACING.md,
  },
  typeCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  typeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  typeLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  typeLabelActive: {
    color: COLORS.primary,
  },
  typeDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
    minHeight: 150,
  },
  charCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  tipsBox: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
  },
  privacyNote: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

