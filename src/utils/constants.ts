// Buzzy App Constants

export const CATEGORIES = [
  { id: 'music', emoji: '🎵', label: 'Pop-up Music', color: '#FF6B6B' },
  { id: 'cafe', emoji: '☕', label: 'Café Meetup', color: '#4ECDC4' },
  { id: 'yard', emoji: '🛍️', label: 'Yard/Swap', color: '#45B7D1' },
  { id: 'food', emoji: '🍔', label: 'Food Truck', color: '#96CEB4' },
  { id: 'wellness', emoji: '🧘', label: 'Wellness', color: '#FFEAA7' },
  { id: 'art', emoji: '🎨', label: 'Art', color: '#DDA0DD' },
  { id: 'sports', emoji: '🏀', label: 'Pickup Game', color: '#FFB347' },
  { id: 'other', emoji: '📍', label: 'Other', color: '#A8A8A8' },
] as const;

export const REPORT_REASONS = [
  { id: 'spam', label: 'Spam or repetitive content' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'fake', label: 'Fake or misleading event' },
  { id: 'other', label: 'Other reason' },
] as const;

export const COLORS = {
  primary: '#FFC107',        // Yellow
  primaryDark: '#FF9800',    // Orange  
  secondary: '#6B7280',      // Gray (for disabled states)
  accent: '#FF9800',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
} as const;

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const DEFAULT_LOCATION = {
  latitude: 37.7749,  // San Francisco
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const MAP_CONFIG = {
  defaultRadius: 5000, // 5km in meters
  maxRadius: 25000,    // 25km max
  minRadius: 1000,     // 1km min
};

export const EVENT_CONFIG = {
  titleMinLength: 3,
  titleMaxLength: 80,
  maxEventsPerHour: 5, // Rate limiting
  defaultDurationHours: 2,
  gracePerionHours: 6, // How long to keep expired events
};
