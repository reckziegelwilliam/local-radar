import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { COLORS } from '../src/utils/constants';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)/map');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [user, loading, router]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: COLORS.background 
    }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
