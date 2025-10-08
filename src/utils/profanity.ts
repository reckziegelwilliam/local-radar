// Simple profanity filter for client-side validation
// Note: Server-side validation should be more comprehensive

const bannedWords = [
  // Basic profanity (add more as needed based on your content policy)
  'spam', 'scam', 'fake', 'fraud',
  // Add more words as appropriate for your use case
  // Keep this list minimal and rely more on server-side filtering
];

const suspiciousPatterns = [
  /\b(buy now|click here|urgent|limited time)\b/i,
  /\b(money back|guaranteed|free money)\b/i,
  /\b(act now|don't miss|hurry)\b/i,
  /(.)\1{4,}/g, // Repeated characters (aaaaa, 11111, etc.)
];

export interface ProfanityCheckResult {
  isClean: boolean;
  reason?: string;
}

export function checkProfanity(text: string): ProfanityCheckResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true };
  }

  const lowerText = text.toLowerCase().trim();

  // Check for banned words
  for (const word of bannedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      return { 
        isClean: false, 
        reason: 'Contains inappropriate content' 
      };
    }
  }

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
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

  if (numberCount > text.length * 0.5) {
    return { 
      isClean: false, 
      reason: 'Suspicious number of digits' 
    };
  }

  return { isClean: true };
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s\-.,!?()]/g, '') // Remove most special characters except common punctuation
    .substring(0, 200); // Limit length
}
