// Simple profanity filter for client-side validation
// Note: Server-side validation should be more comprehensive

import {
  bannedWords,
  suspiciousPatterns,
  personalInfoPatterns,
  allowedPatterns,
} from './profanity-wordlist';

export interface ProfanityCheckResult {
  isClean: boolean;
  reason?: string;
}

/**
 * Check text for profanity, spam, and inappropriate content
 */
export function checkProfanity(text: string): ProfanityCheckResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true };
  }

  const lowerText = text.toLowerCase().trim();

  // Check for banned words
  for (const word of bannedWords) {
    // Use word boundaries to avoid false positives
    const wordPattern = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    if (wordPattern.test(lowerText)) {
      return { 
        isClean: false, 
        reason: 'Contains inappropriate or prohibited content' 
      };
    }
  }

  // Check for personal information patterns
  for (const pattern of personalInfoPatterns) {
    if (pattern.test(text)) {
      return { 
        isClean: false, 
        reason: 'Contains personal information (phone numbers, etc.)' 
      };
    }
  }

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    // Skip if it matches allowed patterns
    const hasAllowedPattern = allowedPatterns.some(allowed => allowed.test(text));
    if (!hasAllowedPattern && pattern.test(text)) {
      return { 
        isClean: false, 
        reason: 'Content appears to be spam or promotional' 
      };
    }
  }

  // Check for excessive special characters or numbers
  const specialCharCount = (text.match(/[!@#$%^&*()_+={}\[\]|\\:";'<>?,./]/g) || []).length;
  const numberCount = (text.match(/\d/g) || []).length;
  
  if (specialCharCount > text.length * 0.3) {
    return { 
      isClean: false, 
      reason: 'Too many special characters' 
    };
  }

  if (numberCount > text.length * 0.5 && text.length > 10) {
    return { 
      isClean: false, 
      reason: 'Suspicious number of digits' 
    };
  }

  // Check for ALL CAPS (spam indicator)
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const letterCount = (text.match(/[A-Za-z]/g) || []).length;
  
  if (letterCount > 10 && capsCount / letterCount > 0.7) {
    return { 
      isClean: false, 
      reason: 'Excessive use of capital letters' 
    };
  }

  return { isClean: true };
}

/**
 * Sanitize text by removing suspicious content
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s\-.,!?()']/g, '') // Remove most special characters except common punctuation
    .substring(0, 200); // Limit length
}

/**
 * Check if text contains URLs
 */
export function containsURL(text: string): boolean {
  const urlPattern = /https?:\/\/|www\.|\.com|\.net|\.org|\.io/i;
  return urlPattern.test(text);
}

/**
 * Check if text is likely spam based on multiple factors
 */
export function isLikelySpam(text: string): { isSpam: boolean; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  let spamScore = 0;

  // Check profanity
  const profanityCheck = checkProfanity(text);
  if (!profanityCheck.isClean) {
    spamScore += 0.5;
    reasons.push(profanityCheck.reason || 'Failed profanity check');
  }

  // Check for URLs
  if (containsURL(text)) {
    spamScore += 0.3;
    reasons.push('Contains URLs');
  }

  // Check length (very short or very long can be spam)
  if (text.length < 10) {
    spamScore += 0.2;
    reasons.push('Too short');
  } else if (text.length > 200) {
    spamScore += 0.2;
    reasons.push('Unusually long');
  }

  // Check for repeated words
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 5 && uniqueWords.size / words.length < 0.5) {
    spamScore += 0.3;
    reasons.push('Excessive word repetition');
  }

  return {
    isSpam: spamScore >= 0.6,
    confidence: Math.min(spamScore, 1.0),
    reasons,
  };
}
