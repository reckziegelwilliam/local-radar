import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '../services/NotificationService';
import { useAuth } from './useAuth';

export function useNotifications() {
  const [initialized, setInitialized] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !initialized) {
      initializeNotifications();
    }
  }, [user, initialized]);

  const initializeNotifications = async () => {
    try {
      const success = await NotificationService.initialize();
      setPermissionGranted(success);
      setInitialized(true);

      if (success) {
        // Set up notification listeners
        setupNotificationListeners();
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setInitialized(true);
      setPermissionGranted(false);
    }
  };

  const setupNotificationListeners = () => {
    // Handle notifications received while app is in foreground
    const notificationListener = NotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        // You can show a custom in-app notification here if desired
      }
    );

    // Handle notification taps
    const responseListener = NotificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        
        const data = response.notification.request.content.data;
        
        // Navigate based on notification type
        if (data.type === 'nearby_event' && data.event_id) {
          router.push(`/event/${data.event_id}`);
        }
      }
    );

    // Return cleanup function
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  };

  const requestPermissions = async () => {
    const success = await NotificationService.initialize();
    setPermissionGranted(success);
    return success;
  };

  const sendTestNotification = async () => {
    await NotificationService.sendTestNotification();
  };

  return {
    initialized,
    permissionGranted,
    requestPermissions,
    sendTestNotification,
  };
}
