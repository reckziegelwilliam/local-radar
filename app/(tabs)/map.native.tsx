import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { EventPin } from '../../src/components/EventPin';
import { useLocation } from '../../src/hooks/useLocation';
import { useNearbyEvents } from '../../src/hooks/useNearbyEvents';
import { useAuth } from '../../src/hooks/useAuth';
import { useNotifications } from '../../src/hooks/useNotifications';
import { OnboardingTooltip } from '../../src/components/OnboardingTooltip';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';
import { Event } from '../../src/types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, CATEGORIES } from '../../src/utils/constants';

export default function MapScreen() {
  const { user } = useAuth();
  const { location, region, loading: locationLoading, refreshLocation } = useLocation();
  const { events, loading: eventsLoading, refreshEvents } = useNearbyEvents(location);
  const { initialized: notificationsInitialized } = useNotifications();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Buzzy!',
      description: 'Discover hyperlocal micro-events happening right around you.',
    },
    {
      id: 'map',
      title: 'Your Event Map',
      description: 'See all nearby events on the map. Tap any pin to learn more!',
    },
    {
      id: 'create',
      title: 'Create Events',
      description: 'Tap the + button to post your own event and let others know what\'s happening.',
    },
  ];

  const isLoading = locationLoading || eventsLoading;

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleEventDetails = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  const handleCreateEvent = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to create events.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/sign-in') },
        ]
      );
      return;
    }

    router.push('/create');
  };

  const handleRefresh = async () => {
    await Promise.all([
      refreshLocation(),
      refreshEvents(),
    ]);
  };

  const animateToLocation = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Welcome to Buzzy"
          description="Sign in to discover events happening around you"
          actionText="Sign In"
          onActionPress={() => router.push('/(auth)/sign-in')}
        />
      </View>
    );
  }

  if (isLoading && !region) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Location Required"
          description="Enable location access to see nearby events"
          actionText="Retry"
          onActionPress={refreshLocation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OnboardingTooltip steps={onboardingSteps} storageKey="map_onboarding_seen" />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {events.map((event) => (
          <EventPin
            key={event.id}
            event={event}
            onPress={handleEventPress}
          />
        ))}
      </MapView>

      {/* Controls Overlay */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={animateToLocation}
        >
          <Text style={styles.locationButtonText}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>
            {isLoading ? '⏳' : '🔄'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateEvent}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>

      {/* Event Details Modal */}
      {selectedEvent && (
        <View style={styles.eventModal}>
          <ScrollView
            style={styles.eventModalContent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
            }
          >
            <View style={styles.eventModalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedEvent(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.eventDetails}>
              <View style={styles.eventHeader}>
                <View style={[
                  styles.eventIcon,
                  { backgroundColor: CATEGORIES.find(c => c.id === selectedEvent.category)?.color || COLORS.secondary }
                ]}>
                  <Text style={styles.eventEmoji}>
                    {CATEGORIES.find(c => c.id === selectedEvent.category)?.emoji || '📍'}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                  <Text style={styles.eventCategory}>
                    {CATEGORIES.find(c => c.id === selectedEvent.category)?.label || 'Other'}
                  </Text>
                </View>
              </View>

              <View style={styles.eventStats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{selectedEvent.rsvp_count}</Text>
                  <Text style={styles.statLabel}>Going</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {new Date(selectedEvent.starts_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.statLabel}>Date</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {new Date(selectedEvent.starts_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  <Text style={styles.statLabel}>Time</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleEventDetails(selectedEvent)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner size="small" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: SPACING.md,
    alignItems: 'flex-end',
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 20,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: SPACING.md,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    fontSize: 24,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  eventModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '50%',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  eventModalContent: {
    flex: 1,
  },
  eventModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  eventDetails: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  eventEmoji: {
    fontSize: 24,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  eventCategory: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 10,
    left: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
