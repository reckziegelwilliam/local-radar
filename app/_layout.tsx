import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../src/hooks/useAuth';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { OfflineBanner } from '../src/components/OfflineBanner';
import { DeepLinkHandler } from '../src/utils/deepLinking';
import { ShakeDetector } from '../src/utils/shakeDetector';
import { ErrorTracking } from '../src/services/ErrorTrackingService';
import { COLORS } from '../src/utils/constants';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    // Initialize error tracking
    ErrorTracking.initialize();
    
    // Initialize deep linking for magic link authentication
    const subscription = DeepLinkHandler.initialize();
    
    // Initialize shake-to-report for beta
    ShakeDetector.initialize();
    
    return () => {
      subscription?.then(sub => sub?.remove());
      ShakeDetector.cleanup();
    };
  }, []);

  useEffect(() => {
    // Hide splash screen when fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Splash screen stays visible
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineBanner />
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="create" 
          options={{ 
            title: 'Create Event',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="feedback" 
          options={{ 
            title: 'Beta Feedback',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            headerStyle: {
              backgroundColor: COLORS.background,
            },
          }} 
        />
      </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
