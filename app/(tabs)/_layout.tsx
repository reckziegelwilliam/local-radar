import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS } from '../../src/utils/constants';

function TabBarIcon({ focused, children }: { focused: boolean; children: string }) {
  return (
    <Text style={{ 
      fontSize: 24, 
      color: focused ? COLORS.primary : COLORS.secondary 
    }}>
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    // This will be handled by the auth system
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused}>🗺️</TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
