import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/services/supabase';
import { Event } from '../../src/types';
import { CATEGORIES, COLORS, TYPOGRAPHY, SPACING, RADIUS, REPORT_REASONS } from '../../src/utils/constants';
import { LocationService } from '../../src/services/LocationService';
import { logger } from '../../src/utils/logger';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [isRsvped, setIsRsvped] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchEvent(id);
      checkUserRsvp(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      // Use RPC function to get event with extracted coordinates
      const { data, error } = await supabase.rpc('get_event_with_location', {
        event_id_param: eventId
      });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Event not found');
      }

      const eventData: Event = data[0];
      setEvent(eventData);
    } catch (error) {
      logger.error('Error fetching event:', error);
      Alert.alert('Error', 'Failed to load event details.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const checkUserRsvp = async (eventId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('event_id')
        .eq('event_id', eventId)
        .eq('profile_id', user.id)
        .single();

      setIsRsvped(!!data);
    } catch (error) {
      // RSVP doesn't exist, which is fine
      setIsRsvped(false);
    }
  };

  const handleRsvp = async () => {
    if (!event || !user) return;

    setRsvpLoading(true);

    try {
      const { data, error } = await supabase.rpc('toggle_event_rsvp', {
        event_id_param: event.id,
      });

      if (error) {
        throw error;
      }

      setIsRsvped(data.is_rsvped);
      setEvent(prev => prev ? { ...prev, rsvp_count: data.rsvp_count } : null);
    } catch (error) {
      logger.error('Error toggling RSVP:', error);
      Alert.alert('Error', 'Failed to update RSVP. Please try again.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleReport = async (reason: string) => {
    if (!event || !user) return;

    setReportLoading(true);

    try {
      const { error } = await supabase.rpc('report_event', {
        event_id_param: event.id,
        reason_param: reason,
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Report Submitted',
        'Thank you for reporting this event. We\'ll review it shortly.',
        [{ text: 'OK', onPress: () => setShowReportModal(false) }]
      );
    } catch (error: any) {
      logger.error('Error reporting event:', error);
      
      let errorMessage = 'Failed to submit report. Please try again.';
      if (error.message?.includes('duplicate')) {
        errorMessage = 'You have already reported this event.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setReportLoading(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      await Share.share({
        message: `Check out this event on Buzzy: ${event.title}`,
        url: `buzzy://event/${event.id}`,
      });
    } catch (error) {
      logger.error('Error sharing event:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return LocationService.formatDistance(distance);
  };

  const getTimeStatus = () => {
    if (!event) return '';
    
    const now = new Date();
    const startTime = new Date(event.starts_at);
    const endTime = new Date(event.ends_at);

    if (now < startTime) {
      const diffMs = startTime.getTime() - now.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      
      if (diffHours === 0) {
        return 'Starting soon';
      } else if (diffHours === 1) {
        return 'Starting in 1 hour';
      } else if (diffHours < 24) {
        return `Starting in ${diffHours} hours`;
      } else {
        return 'Upcoming';
      }
    } else if (now >= startTime && now <= endTime) {
      return 'Happening now!';
    } else {
      return 'Ended';
    }
  };

  const category = event ? CATEGORIES.find(cat => cat.id === event.category) : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      {event.photo_url ? (
        <Image source={{ uri: event.photo_url }} style={styles.headerImage} />
      ) : (
        <View style={[styles.headerImage, styles.placeholderImage]}>
          <Text style={styles.placeholderEmoji}>{category?.emoji || '📍'}</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Title and Category */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryEmoji}>{category?.emoji || '📍'}</Text>
            <Text style={styles.categoryText}>{category?.label || 'Other'}</Text>
          </View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.timeStatus}>{getTimeStatus()}</Text>
        </View>

        {/* Time and Location */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>When</Text>
              <Text style={styles.infoText}>
                Starts: {formatDateTime(event.starts_at)}
              </Text>
              <Text style={styles.infoText}>
                Ends: {formatDateTime(event.ends_at)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoText}>
                Near your current location
                {event.distance_m && ` • ${formatDistance(event.distance_m)}`}
              </Text>
            </View>
          </View>
        </View>

        {/* RSVP Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.rsvpButton,
              isRsvped && styles.rsvpButtonActive,
              rsvpLoading && styles.rsvpButtonDisabled,
            ]}
            onPress={handleRsvp}
            disabled={rsvpLoading || !user}
          >
            <Text style={[
              styles.rsvpButtonText,
              isRsvped && styles.rsvpButtonTextActive,
            ]}>
              {rsvpLoading 
                ? 'Updating...' 
                : isRsvped 
                  ? "✓ You're in!" 
                  : "I'm interested"}
            </Text>
          </TouchableOpacity>

          {event.rsvp_count > 0 && (
            <Text style={styles.rsvpCount}>
              {event.rsvp_count} {event.rsvp_count === 1 ? 'person' : 'people'} interested
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          {user && user.id !== event.creator && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowReportModal(true)}
            >
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Report Modal */}
        {showReportModal && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Event</Text>
              <Text style={styles.modalText}>
                Why are you reporting this event?
              </Text>
              
              {REPORT_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={styles.reportOption}
                  onPress={() => handleReport(reason.id)}
                  disabled={reportLoading}
                >
                  <Text style={styles.reportOptionText}>{reason.label}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowReportModal(false)}
                disabled={reportLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.surface,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 60,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 32,
  },
  timeStatus: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.accent,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  rsvpButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rsvpButtonActive: {
    backgroundColor: COLORS.success,
  },
  rsvpButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  rsvpButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
  },
  rsvpButtonTextActive: {
    color: COLORS.text.inverse,
  },
  rsvpCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: -SPACING.lg,
    right: -SPACING.lg,
    bottom: -SPACING.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '80%',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  reportOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  reportOptionText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
