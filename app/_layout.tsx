import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../src/hooks/useAuth';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { DeepLinkHandler } from '../src/utils/deepLinking';
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
    
    return () => {
      subscription?.then(sub => sub?.remove());
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
      </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
