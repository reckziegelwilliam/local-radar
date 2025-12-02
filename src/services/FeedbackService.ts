import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { supabase } from './supabase';
import { logger } from '../utils/logger';

export interface FeedbackData {
  feedback: string;
  feedbackType: 'bug' | 'feature' | 'general';
  screenName?: string;
}

export class FeedbackService {
  static async submitFeedback(data: FeedbackData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Gather device info
      const deviceInfo = {
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        platform: Platform.OS,
        platformVersion: Platform.Version,
        isDevice: Device.isDevice,
      };

      // Get app version
      const appVersion = Constants.expoConfig?.version || '1.0.0';

      // Submit to database
      const { error } = await supabase
        .from('beta_feedback')
        .insert({
          user_id: user.id,
          feedback: data.feedback.trim(),
          feedback_type: data.feedbackType,
          platform: Platform.OS,
          app_version: appVersion,
          device_info: deviceInfo,
          screen_name: data.screenName,
        });

      if (error) {
        logger.error('Error submitting feedback:', error);
        return { success: false, error: error.message };
      }

      logger.log('Feedback submitted successfully');
      return { success: true };
    } catch (error: any) {
      logger.error('Exception submitting feedback:', error);
      return { success: false, error: error.message || 'Failed to submit feedback' };
    }
  }
}

