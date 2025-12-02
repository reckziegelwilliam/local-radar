import { useEffect } from 'react';
import RNShake from 'react-native-shake';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { logger } from './logger';

export class ShakeDetector {
  private static subscription: any = null;

  static initialize(): void {
    // Only enable shake-to-report in beta builds on physical devices
    const isBeta = Constants.expoConfig?.extra?.isBeta === true;
    
    if (!isBeta) {
      logger.log('Shake detector disabled - not a beta build');
      return;
    }

    if (Platform.OS === 'web') {
      logger.log('Shake detector not available on web');
      return;
    }

    try {
      this.subscription = RNShake.addListener(() => {
        logger.log('Shake detected - opening feedback screen');
        
        // Show quick confirmation
        if (Platform.OS === 'ios') {
          // On iOS, we can navigate directly
          router.push('/feedback?type=bug');
        } else {
          // On Android, show a brief alert first
          Alert.alert(
            'Report Issue',
            'Opening feedback form...',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => router.push('/feedback?type=bug') }
            ],
            { cancelable: true }
          );
        }
      });

      logger.log('Shake detector initialized');
    } catch (error) {
      logger.error('Failed to initialize shake detector:', error);
    }
  }

  static cleanup(): void {
    if (this.subscription) {
      RNShake.removeAllListeners();
      this.subscription = null;
      logger.log('Shake detector cleaned up');
    }
  }
}

// React hook for using shake detector
export function useShakeDetector(): void {
  useEffect(() => {
    ShakeDetector.initialize();

    return () => {
      ShakeDetector.cleanup();
    };
  }, []);
}

