import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../src/utils/constants';
import Constants from 'expo-constants';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(__DEV__); // Default to password in development
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signInWithPassword, signUpWithPassword } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (usePassword && !password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      if (usePassword) {
        // Password authentication (for Expo Go development)
        const authFunction = isSignUp ? signUpWithPassword : signInWithPassword;
        const { error } = await authFunction(email.trim().toLowerCase(), password);
        
        if (error) {
          Alert.alert(isSignUp ? 'Sign Up Error' : 'Sign In Error', error.message);
        } else {
          if (isSignUp) {
            Alert.alert('Account Created!', 'Your account has been created successfully.');
          }
          // Authentication successful - useAuth will handle navigation
        }
      } else {
        // Magic link authentication (for production)
        const { error } = await signIn(email.trim().toLowerCase());
        
        if (error) {
          Alert.alert('Sign In Error', error.message);
        } else {
          Alert.alert(
            'Check your email!',
            'We sent you a magic link to sign in. Click the link in your email to continue.',
            [
              {
                text: 'OK',
              },
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestUser = () => {
    setEmail('test@buzzy.app');
    setPassword('test123456');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Beta Welcome Banner */}
        {Constants.expoConfig?.extra?.isBeta === true && (
          <View style={styles.betaBanner}>
            <Text style={styles.betaBannerEmoji}>🧪</Text>
            <Text style={styles.betaBannerTitle}>Thank you for beta testing Buzzy!</Text>
            <Text style={styles.betaBannerText}>
              Your feedback will help us improve. Shake your device anytime to report issues.
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>Buzzy</Text>
          <Text style={styles.subtitle}>
            Discover hyperlocal micro-events happening right around you
          </Text>
        </View>

        <View style={styles.form}>
          {/* Development Mode Toggle */}
          {__DEV__ && (
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, !usePassword && styles.modeButtonActive]}
                onPress={() => setUsePassword(false)}
              >
                <Text style={[styles.modeButtonText, !usePassword && styles.modeButtonTextActive]}>
                  Magic Link
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, usePassword && styles.modeButtonActive]}
                onPress={() => setUsePassword(true)}
              >
                <Text style={[styles.modeButtonText, usePassword && styles.modeButtonTextActive]}>
                  Password (Dev)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={COLORS.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Password Input (Development Mode) */}
          {usePassword && (
            <>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="your password"
                placeholderTextColor={COLORS.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              {/* Sign Up / Sign In Toggle */}
              <View style={styles.authToggle}>
                <TouchableOpacity
                  style={[styles.authToggleButton, !isSignUp && styles.authToggleButtonActive]}
                  onPress={() => setIsSignUp(false)}
                >
                  <Text style={[styles.authToggleText, !isSignUp && styles.authToggleTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authToggleButton, isSignUp && styles.authToggleButtonActive]}
                  onPress={() => setIsSignUp(true)}
                >
                  <Text style={[styles.authToggleText, isSignUp && styles.authToggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading 
                ? (usePassword ? (isSignUp ? 'Creating Account...' : 'Signing In...') : 'Sending...')
                : (usePassword ? (isSignUp ? 'Create Account' : 'Sign In') : 'Send Magic Link')
              }
            </Text>
          </TouchableOpacity>

          {/* Quick Test User Button (Development Only) */}
          {__DEV__ && usePassword && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestUser}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                Use Test Account
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.disclaimer}>
            By continuing, you agree to our terms of service and privacy policy.
            {usePassword ? ' Development mode uses password authentication.' : " We'll send you a secure link to sign in without passwords."}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['4xl'],
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
  },
  disclaimer: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.xs,
  },
  modeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.secondary,
  },
  modeButtonTextActive: {
    color: COLORS.text.primary,
  },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.xs,
  },
  authToggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  authToggleButtonActive: {
    backgroundColor: COLORS.accent,
  },
  authToggleText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.secondary,
  },
  authToggleTextActive: {
    color: COLORS.text.inverse,
  },
  testButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  testButtonText: {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
  },
  betaBanner: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    alignItems: 'center',
  },
  betaBannerEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  betaBannerTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  betaBannerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
