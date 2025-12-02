// Comprehensive Profanity Wordlist
// This file contains banned words and patterns for content moderation
// Note: This is a basic list. Consider using a professional library like 'bad-words' in production

/**
 * Banned Words Categories
 * Organized by type for easier management and updates
 */

// Spam and Scam Related
export const spamWords = [
  'spam',
  'scam',
  'fake',
  'fraud',
  'phishing',
  'ponzi',
  'pyramid scheme',
  'mlm',
  'multi-level marketing',
  'get rich quick',
  'work from home',
  'bitcoin giveaway',
  'crypto scam',
  'investment opportunity',
  'guaranteed profit',
  'double your money',
];

// Promotional/Commercial (too aggressive for events app)
export const commercialWords = [
  'buy now',
  'click here now',
  'limited offer',
  'act fast',
  'don\'t miss out',
  'exclusive deal',
  'make money fast',
  'earn cash',
  'free trial',
  'no credit card',
  'risk free',
  'satisfaction guaranteed',
];

// Inappropriate Content
export const inappropriateWords = [
  'drugs',
  'cocaine',
  'heroin',
  'meth',
  'marijuana sale',
  'weed for sale',
  'pills',
  'prescription drugs',
  'adult content',
  'escort',
  'sex work',
  'prostitution',
];

// Violent Content
export const violentWords = [
  'weapon',
  'guns for sale',
  'ammunition',
  'explosives',
  'bomb',
  'violence',
  'fight club',
  'illegal fighting',
];

// Hate Speech (basic examples - consider using a professional service)
export const hateSpeechWords = [
  'hate',
  'racist',
  'discrimination',
  'supremacy',
];

// Personal Information (protect users)
export const personalInfoPatterns = [
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, // SSN
  /\b\d{16}\b/g, // Credit card numbers
];

/**
 * All banned words combined
 */
export const bannedWords = [
  ...spamWords,
  ...commercialWords,
  ...inappropriateWords,
  ...violentWords,
  ...hateSpeechWords,
];

/**
 * Suspicious patterns that might indicate spam or inappropriate content
 */
export const suspiciousPatterns = [
  // Urgency language
  /\b(buy now|click here|urgent|limited time|act now|don't miss|hurry)\b/i,
  
  // Money-related scams
  /\b(money back|guaranteed|free money|get rich|earn \$\d+|make \$\d+)\b/i,
  
  // Excessive punctuation/caps
  /!!!{3,}/, // Multiple exclamation marks
  /\?\?\?{3,}/, // Multiple question marks
  /[A-Z]{10,}/, // ALL CAPS words (10+ chars)
  
  // Repeated characters (aaaaa, 11111, etc.)
  /(.)\1{4,}/g,
  
  // Multiple emojis in a row (potential spam)
  /([\u{1F300}-\u{1F9FF}]){5,}/u,
  
  // URLs with common spam TLDs
  /\b(bit\.ly|tinyurl|goo\.gl)\b/i,
  
  // Cryptocurrency scams
  /\b(bitcoin|crypto|ethereum|nft).*(giveaway|free|airdrop)\b/i,
  
  // Contact info solicitation
  /\b(whatsapp|telegram|signal|dm me|text me)\b/i,
];

/**
 * Legitimate patterns that should be allowed despite containing numbers
 * (to avoid false positives)
 */
export const allowedPatterns = [
  /\b\d{1,2}(am|pm|AM|PM)\b/, // Times like 5pm, 11am
  /\b\d{1,2}:\d{2}\b/, // Times like 5:30, 11:45
  /\$\d{1,3}\b/, // Reasonable prices like $5, $20, $100
  /\b\d{1,2}\s*(hour|hr|min|mins|minute)\b/i, // Durations
];

/**
 * Categories that are okay for certain types of legitimate events
 * but need context checking
 */
export const contextualWords = {
  food: ['food', 'drinks', 'beer', 'wine', 'restaurant', 'cafe'],
  sales: ['sale', 'selling', 'buy', 'trade', 'swap', 'garage sale', 'yard sale'],
  music: ['concert', 'band', 'dj', 'music', 'performance'],
};

