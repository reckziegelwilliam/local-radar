// Validation Tests
// Tests for validation utility functions

import {
  validateEventTitle,
  validateEventTimes,
  validateLocation,
  validateCategory,
} from '../../src/utils/validation';
import { describe, it, expect } from '@jest/globals';
describe('validateEventTitle', () => {
  it('should accept valid titles', () => {
    expect(validateEventTitle('Jazz Concert in the Park').isValid).toBe(true);
    expect(validateEventTitle('BBQ & Potluck @ 5pm').isValid).toBe(true);
    expect(validateEventTitle('Study Group').isValid).toBe(true);
  });

  it('should reject empty titles', () => {
    expect(validateEventTitle('').isValid).toBe(false);
    expect(validateEventTitle('   ').isValid).toBe(false);
  });

  it('should reject titles that are too short', () => {
    const result = validateEventTitle('Hi');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('at least');
  });

  it('should reject titles that are too long', () => {
    const longTitle = 'a'.repeat(100);
    const result = validateEventTitle(longTitle);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('less than');
  });
});

describe('validateEventTimes', () => {
  it('should accept future event times', () => {
    const starts = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const ends = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    expect(validateEventTimes(starts, ends).isValid).toBe(true);
  });

  it('should reject past start times', () => {
    const starts = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    const ends = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const result = validateEventTimes(starts, ends);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('future');
  });

  it('should reject end time before start time', () => {
    const starts = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const ends = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const result = validateEventTimes(starts, ends);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('after');
  });

  it('should reject events longer than 24 hours', () => {
    const starts = new Date(Date.now() + 60 * 60 * 1000);
    const ends = new Date(Date.now() + 25 * 60 * 60 * 1000); // 25 hours later
    const result = validateEventTimes(starts, ends);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('24 hours');
  });
});

describe('validateLocation', () => {
  it('should accept valid coordinates', () => {
    expect(validateLocation(37.7749, -122.4194).isValid).toBe(true); // San Francisco
    expect(validateLocation(0, 0).isValid).toBe(true); // Null Island
    expect(validateLocation(-90, -180).isValid).toBe(true); // Extremes
    expect(validateLocation(90, 180).isValid).toBe(true); // Extremes
  });

  it('should reject invalid latitude', () => {
    expect(validateLocation(91, 0).isValid).toBe(false);
    expect(validateLocation(-91, 0).isValid).toBe(false);
  });

  it('should reject invalid longitude', () => {
    expect(validateLocation(0, 181).isValid).toBe(false);
    expect(validateLocation(0, -181).isValid).toBe(false);
  });
});

describe('validateCategory', () => {
  const validCategories = ['music', 'cafe', 'yard', 'food', 'wellness', 'art', 'sports', 'other'];

  validCategories.forEach(category => {
    it(`should accept valid category: ${category}`, () => {
      expect(validateCategory(category).isValid).toBe(true);
    });
  });

  it('should reject invalid categories', () => {
    expect(validateCategory('invalid').isValid).toBe(false);
    expect(validateCategory('').isValid).toBe(false);
    expect(validateCategory('MUSIC').isValid).toBe(false); // Case sensitive
  });
});

