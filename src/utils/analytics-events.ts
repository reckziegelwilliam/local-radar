// Analytics Events
// Centralized definitions for all analytics events tracked in the app

/**
 * Authentication Events
 */
export const AuthEvents = {
  SIGN_IN_STARTED: 'auth_sign_in_started',
  SIGN_IN_SUCCESS: 'auth_sign_in_success',
  SIGN_IN_FAILED: 'auth_sign_in_failed',
  SIGN_UP_STARTED: 'auth_sign_up_started',
  SIGN_UP_SUCCESS: 'auth_sign_up_success',
  SIGN_UP_FAILED: 'auth_sign_up_failed',
  SIGN_OUT: 'auth_sign_out',
  MAGIC_LINK_SENT: 'auth_magic_link_sent',
  MAGIC_LINK_OPENED: 'auth_magic_link_opened',
};

/**
 * Event Creation Events
 */
export const EventCreationEvents = {
  CREATE_STARTED: 'event_create_started',
  CREATE_SUCCESS: 'event_create_success',
  CREATE_FAILED: 'event_create_failed',
  CREATE_CANCELLED: 'event_create_cancelled',
  PHOTO_ADDED: 'event_photo_added',
  PHOTO_REMOVED: 'event_photo_removed',
  CATEGORY_SELECTED: 'event_category_selected',
  TIME_ADJUSTED: 'event_time_adjusted',
};

/**
 * Event Interaction Events
 */
export const EventInteractionEvents = {
  EVENT_VIEWED: 'event_viewed',
  EVENT_DETAIL_OPENED: 'event_detail_opened',
  RSVP_ADDED: 'event_rsvp_added',
  RSVP_REMOVED: 'event_rsvp_removed',
  EVENT_REPORTED: 'event_reported',
  EVENT_SHARED: 'event_shared',
  EVENT_DELETED: 'event_deleted',
};

/**
 * Map Events
 */
export const MapEvents = {
  MAP_VIEWED: 'map_viewed',
  MAP_ZOOMED: 'map_zoomed',
  MAP_PANNED: 'map_panned',
  PIN_CLICKED: 'map_pin_clicked',
  LOCATION_PERMISSION_GRANTED: 'map_location_permission_granted',
  LOCATION_PERMISSION_DENIED: 'map_location_permission_denied',
  FILTER_APPLIED: 'map_filter_applied',
  FILTER_CLEARED: 'map_filter_cleared',
};

/**
 * Notification Events
 */
export const NotificationEvents = {
  PERMISSION_REQUESTED: 'notification_permission_requested',
  PERMISSION_GRANTED: 'notification_permission_granted',
  PERMISSION_DENIED: 'notification_permission_denied',
  RECEIVED: 'notification_received',
  OPENED: 'notification_opened',
  DISMISSED: 'notification_dismissed',
};

/**
 * Error Events
 */
export const ErrorEvents = {
  API_ERROR: 'error_api',
  NETWORK_ERROR: 'error_network',
  LOCATION_ERROR: 'error_location',
  CAMERA_ERROR: 'error_camera',
  UPLOAD_ERROR: 'error_upload',
  AUTH_ERROR: 'error_auth',
  GENERIC_ERROR: 'error_generic',
};

/**
 * Screen Names
 */
export const Screens = {
  MAP: 'Map',
  SIGN_IN: 'SignIn',
  CREATE_EVENT: 'CreateEvent',
  EVENT_DETAIL: 'EventDetail',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

/**
 * User Properties
 */
export const UserProperties = {
  EVENTS_CREATED: 'events_created_count',
  EVENTS_RSVPED: 'events_rsvped_count',
  EVENTS_REPORTED: 'events_reported_count',
  ACCOUNT_AGE_DAYS: 'account_age_days',
  LAST_ACTIVE: 'last_active_date',
  PREFERRED_CATEGORIES: 'preferred_categories',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LOCATION_PERMISSION: 'location_permission',
};

/**
 * Event Property Keys
 */
export const EventProperties = {
  EVENT_ID: 'event_id',
  EVENT_CATEGORY: 'event_category',
  EVENT_TITLE: 'event_title',
  HAS_PHOTO: 'has_photo',
  DURATION_HOURS: 'duration_hours',
  DISTANCE_KM: 'distance_km',
  RSVP_COUNT: 'rsvp_count',
  ERROR_MESSAGE: 'error_message',
  ERROR_CODE: 'error_code',
  SCREEN_NAME: 'screen_name',
  SOURCE: 'source',
  SUCCESS: 'success',
};

