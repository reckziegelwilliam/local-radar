import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CategorySelector } from '../src/components/CategorySelector';
import { useAuth } from '../src/hooks/useAuth';
import { useLocation } from '../src/hooks/useLocation';
import { supabase } from '../src/services/supabase';
import { validateEventTitle, validateEventTimes, validateCategory } from '../src/utils/validation';
import { checkProfanity } from '../src/utils/profanity';
import { CategoryId, CreateEventData } from '../src/types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, EVENT_CONFIG } from '../src/utils/constants';
import { logger } from '../src/utils/logger';

export default function CreateEventScreen() {
  const { user } = useAuth();
  const { location } = useLocation();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to next 15 min
    return now;
  });
  const [endTime, setEndTime] = useState(() => {
    const end = new Date();
    end.setHours(end.getHours() + EVENT_CONFIG.defaultDurationHours);
    end.setMinutes(Math.ceil(end.getMinutes() / 15) * 15);
    return end;
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/sign-in');
    }
  }, [user, router]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library access to add images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      logger.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImage = async (uri: string, retryCount = 0): Promise<string | null> => {
    try {
      // Compress image before upload
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }], // Max width 1920px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();
      
      const fileExt = 'jpg'; // Always use jpg after compression
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(filePath, blob);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('event-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      logger.error('Error uploading image:', error);
      
      // Retry logic
      if (retryCount < 2) {
        return new Promise((resolve) => {
          Alert.alert(
            'Photo Upload Failed',
            'Would you like to retry uploading the photo?',
            [
              { 
                text: 'Retry', 
                onPress: async () => {
                  const result = await uploadImage(uri, retryCount + 1);
                  resolve(result);
                }
              },
              { 
                text: 'Skip Photo', 
                onPress: () => resolve(null),
                style: 'cancel'
              },
            ]
          );
        });
      }
      
      return null;
    }
  };

  const validateForm = (): string | null => {
    const titleValidation = validateEventTitle(title);
    if (!titleValidation.isValid) {
      return titleValidation.error || 'Invalid title';
    }

    const profanityCheck = checkProfanity(title);
    if (!profanityCheck.isClean) {
      return profanityCheck.reason || 'Title contains inappropriate content';
    }

    if (!category) {
      return 'Please select a category';
    }

    const categoryValidation = validateCategory(category);
    if (!categoryValidation.isValid) {
      return categoryValidation.error || 'Invalid category';
    }

    const timeValidation = validateEventTimes(startTime, endTime);
    if (!timeValidation.isValid) {
      return timeValidation.error || 'Invalid event times';
    }

    if (!location) {
      return 'Location is required. Please enable location services.';
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (!location || !category) {
      return;
    }

    setLoading(true);

    try {
      let photoUrl: string | null = null;
      if (photo) {
        photoUrl = await uploadImage(photo);
        
      }

      const { data: eventId, error } = await supabase.rpc('create_event', {
        title_param: title.trim(),
        category_param: category,
        starts_at_param: startTime.toISOString(),
        ends_at_param: endTime.toISOString(),
        lat_param: location.latitude,
        lng_param: location.longitude,
        photo_url_param: photoUrl,
      });

      if (error) {
        throw error;
      }

      // Trigger notifications for nearby users (non-blocking)
      try {
        await supabase.functions.invoke('send-nearby-notification', {
          body: {
            event_id: eventId,
            event_title: title.trim(),
            event_category: category,
            event_lat: location.latitude,
            event_lng: location.longitude,
          },
        });
        logger.log('Nearby user notifications sent');
      } catch (notifError) {
        // Don't fail event creation if notifications fail
        logger.log('Notification trigger failed (non-critical):', notifError);
      }

      Alert.alert(
        'Event Created!',
        'Your event has been posted and is now visible to people nearby.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      logger.error('Error creating event:', error);
      
      let errorMessage = 'Failed to create event. Please try again.';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'You\'ve created too many events recently. Please wait before creating another.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const adjustTime = (time: Date, minutes: number): Date => {
    const newTime = new Date(time);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    return newTime;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Event Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What's happening?"
              placeholderTextColor={COLORS.text.secondary}
              value={title}
              onChangeText={setTitle}
              maxLength={EVENT_CONFIG.titleMaxLength}
              multiline
              editable={!loading}
            />
            <Text style={styles.charCount}>
              {title.length}/{EVENT_CONFIG.titleMaxLength}
            </Text>
          </View>

          {/* Category Selection */}
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>When</Text>
            
            <View style={styles.timeRow}>
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Starts</Text>
                <View style={styles.timeControls}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setStartTime(adjustTime(startTime, -15))}
                    disabled={loading}
                  >
                    <Text style={styles.timeButtonText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.timeDisplay}>
                    <Text style={styles.timeText}>{formatDate(startTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(startTime)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setStartTime(adjustTime(startTime, 15))}
                    disabled={loading}
                  >
                    <Text style={styles.timeButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Ends</Text>
                <View style={styles.timeControls}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setEndTime(adjustTime(endTime, -15))}
                    disabled={loading}
                  >
                    <Text style={styles.timeButtonText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.timeDisplay}>
                    <Text style={styles.timeText}>{formatDate(endTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(endTime)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setEndTime(adjustTime(endTime, 15))}
                    disabled={loading}
                  >
                    <Text style={styles.timeButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.section}>
            <Text style={styles.label}>Photo (Optional)</Text>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setPhoto(null)}
                  disabled={loading}
                >
                  <Text style={styles.removePhotoText}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.photoButton}
                onPress={pickImage}
                disabled={loading}
              >
                <Text style={styles.photoButtonText}>📷 Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Location Info */}
          {location && (
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.locationText}>
                📍 Using your current location
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your event will be visible to people within 5km and will automatically 
            expire 6 hours after the end time.
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
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  titleInput: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSection: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  timeLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
  },
  timeButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  timeDisplay: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.primary,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  removePhotoButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: COLORS.text.inverse,
    fontSize: 18,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  photoButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
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
  disclaimer: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.sm,
  },
});
