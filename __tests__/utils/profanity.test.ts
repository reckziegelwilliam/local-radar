// Profanity Filter Tests
// Tests for content moderation and profanity filtering

import { checkProfanity, sanitizeText, containsURL, isLikelySpam } from '../../src/utils/profanity';
import { describe, it, expect } from '@jest/globals';
describe('checkProfanity', () => {
  it('should pass clean content', () => {
    const result = checkProfanity('Jazz concert in the park at 7pm');
    expect(result.isClean).toBe(true);
  });

  it('should detect spam words', () => {
    const result = checkProfanity('Free money scam opportunity');
    expect(result.isClean).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it('should detect spam patterns', () => {
    const result = checkProfanity('BUY NOW!!! Limited time offer!!!');
    expect(result.isClean).toBe(false);
  });

  it('should detect excessive special characters', () => {
    const result = checkProfanity('!!!@@@###$$$%%%^^^');
    expect(result.isClean).toBe(false);
    expect(result.reason).toContain('special characters');
  });

  it('should detect excessive numbers', () => {
    const result = checkProfanity('123456789012345678901234567890');
    expect(result.isClean).toBe(false);
    expect(result.reason).toContain('digits');
  });

  it('should detect phone numbers', () => {
    const result = checkProfanity('Call me at 555-123-4567');
    expect(result.isClean).toBe(false);
    expect(result.reason).toContain('personal information');
  });

  it('should allow reasonable prices', () => {
    const result = checkProfanity('Garage sale - items from $5 to $20');
    // This should pass if properly configured
    expect(result.isClean).toBe(true);
  });
});

describe('sanitizeText', () => {
  it('should remove extra spaces', () => {
    expect(sanitizeText('Hello    World')).toBe('Hello World');
  });

  it('should trim whitespace', () => {
    expect(sanitizeText('  Hello World  ')).toBe('Hello World');
  });

  it('should limit length', () => {
    const longText = 'a'.repeat(300);
    const result = sanitizeText(longText);
    expect(result.length).toBeLessThanOrEqual(200);
  });
});

describe('containsURL', () => {
  it('should detect URLs', () => {
    expect(containsURL('Check out http://example.com')).toBe(true);
    expect(containsURL('Visit www.example.com')).toBe(true);
    expect(containsURL('Go to example.com')).toBe(true);
  });

  it('should not flag non-URLs', () => {
    expect(containsURL('Jazz concert at the park')).toBe(false);
  });
});

describe('isLikelySpam', () => {
  it('should detect obvious spam', () => {
    const result = isLikelySpam('BUY NOW!!! FREE MONEY!!! http://scam.com');
    expect(result.isSpam).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.6);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('should pass legitimate content', () => {
    const result = isLikelySpam('Community BBQ at Main Street Park, 5pm Saturday');
    expect(result.isSpam).toBe(false);
  });

  it('should detect repetitive content', () => {
    const result = isLikelySpam('sale sale sale sale sale sale sale');
    expect(result.isSpam).toBe(true);
    expect(result.reasons).toContain('Excessive word repetition');
  });
});

