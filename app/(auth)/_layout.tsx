import { Stack } from 'expo-router';
import { COLORS } from '../../src/utils/constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
