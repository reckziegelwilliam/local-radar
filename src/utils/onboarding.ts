import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@buzzy:has_seen_onboarding';
const FEATURE_INTRO_PREFIX = '@buzzy:feature_intro:';

export class OnboardingManager {
  /**
   * Check if user has seen the initial onboarding
   */
  static async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as complete
   */
  static async markOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  }

  /**
   * Reset onboarding (for testing/development)
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      // Also reset all feature intros
      const keys = await AsyncStorage.getAllKeys();
      const featureKeys = keys.filter(key => key.startsWith(FEATURE_INTRO_PREFIX));
      await AsyncStorage.multiRemove(featureKeys);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }

  /**
   * Check if user has seen a specific feature introduction
   */
  static async hasSeenFeatureIntro(featureId: string): Promise<boolean> {
    try {
      const key = `${FEATURE_INTRO_PREFIX}${featureId}`;
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      console.error('Error checking feature intro:', error);
      return false;
    }
  }

  /**
   * Mark a feature introduction as seen
   */
  static async markFeatureIntroSeen(featureId: string): Promise<void> {
    try {
      const key = `${FEATURE_INTRO_PREFIX}${featureId}`;
      await AsyncStorage.setItem(key, 'true');
    } catch (error) {
      console.error('Error marking feature intro seen:', error);
    }
  }
}

