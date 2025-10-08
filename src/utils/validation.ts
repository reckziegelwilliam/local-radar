import { EVENT_CONFIG } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEventTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }

  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length < EVENT_CONFIG.titleMinLength) {
    return { 
      isValid: false, 
      error: `Title must be at least ${EVENT_CONFIG.titleMinLength} characters` 
    };
  }

  if (trimmedTitle.length > EVENT_CONFIG.titleMaxLength) {
    return { 
      isValid: false, 
      error: `Title must be less than ${EVENT_CONFIG.titleMaxLength} characters` 
    };
  }

  return { isValid: true };
}

export function validateEventTimes(startsAt: Date, endsAt: Date): ValidationResult {
  const now = new Date();
  
  // Event must start in the future (or within 5 minutes)
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  if (startsAt < fiveMinutesAgo) {
    return { isValid: false, error: 'Event must start in the near future' };
  }

  // Event must end after it starts
  if (endsAt <= startsAt) {
    return { isValid: false, error: 'Event must end after it starts' };
  }

  // Event duration should be reasonable (max 24 hours)
  const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  if (endsAt.getTime() - startsAt.getTime() > maxDuration) {
    return { isValid: false, error: 'Event duration cannot exceed 24 hours' };
  }

  return { isValid: true };
}

export function validateLocation(latitude: number, longitude: number): ValidationResult {
  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: 'Invalid latitude' };
  }

  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: 'Invalid longitude' };
  }

  return { isValid: true };
}

export function validateCategory(category: string): ValidationResult {
  const validCategories = ['music', 'cafe', 'yard', 'food', 'wellness', 'art', 'sports', 'other'];
  
  if (!validCategories.includes(category)) {
    return { isValid: false, error: 'Invalid category' };
  }

  return { isValid: true };
}
