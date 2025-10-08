import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  FlatList,
} from 'react-native';
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

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Buzzy!',
      description: 'Discover hyperlocal micro-events happening right around you.',
    },
    {
      id: 'events',
      title: 'Your Events List',
      description: 'Browse all nearby events in a convenient list format.',
    },
    {
      id: 'create',
      title: 'Create Events',
      description: 'Tap the + button to post your own event and let others know what\'s happening.',
    },
  ];

  const isLoading = locationLoading || eventsLoading;

  const handleEventPress = (event: Event) => {
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

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventPin
      event={item}
      onPress={handleEventPress}
    />
  );

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
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Events</Text>
        <View style={styles.headerControls}>
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
      </View>

      {/* Location Info */}
      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 Showing events near your location
          </Text>
        </View>
      )}

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        style={styles.eventsList}
        contentContainerStyle={styles.eventsListContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Events Nearby"
            description="Be the first to create an event in your area!"
            actionText="Create Event"
            onActionPress={handleCreateEvent}
          />
        }
      />

      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateEvent}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>

      {/* Loading Overlay */}
      {isLoading && events.length > 0 && (
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  locationInfo: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 100, // Space for create button
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
