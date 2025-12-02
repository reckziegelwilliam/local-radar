import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useAuth } from '../src/hooks/useAuth';
import { NotificationService } from '../src/services/NotificationService';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../src/utils/constants';

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const isBeta = Constants.expoConfig?.extra?.isBeta === true;
  const betaVersion = Constants.expoConfig?.extra?.betaVersion;

  const handleSendFeedback = () => {
    router.push('/feedback?type=general');
  };

  const handleReportBug = () => {
    router.push('/feedback?type=bug');
  };

  const handleTestNotification = async () => {
    try {
      await NotificationService.sendTestNotification();
      Alert.alert('Success', 'Test notification sent! You should see it shortly.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification. Make sure notifications are enabled.');
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'About Buzzy',
      'Buzzy is a hyperlocal micro-events app that helps you discover and create spontaneous events happening right around you.\n\nVersion: ' + (betaVersion || appVersion),
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    // Open privacy policy URL
    Linking.openURL('https://yourdomain.com/privacy-policy');
  };

  const handleTermsOfService = () => {
    // Open terms URL
    Linking.openURL('https://yourdomain.com/terms');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profile?.handle || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Beta Section */}
        {isBeta && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beta Testing</Text>
            <View style={styles.card}>
              <MenuItem
                icon="🧪"
                title="Send Feedback"
                onPress={handleSendFeedback}
              />
              <Divider />
              <MenuItem
                icon="🐛"
                title="Report a Bug"
                onPress={handleReportBug}
              />
              <Divider />
              <MenuItem
                icon="📳"
                title="Shake to Report"
                subtitle="Shake your device to open feedback"
                onPress={() => {}}
                disabled
              />
            </View>
          </View>
        )}

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.card}>
            <MenuItem
              icon="🔔"
              title="Test Notifications"
              onPress={handleTestNotification}
            />
            <Divider />
            <MenuItem
              icon="ℹ️"
              title="About Buzzy"
              onPress={handleAbout}
            />
            <Divider />
            <MenuItem
              icon="📱"
              title="App Version"
              subtitle={betaVersion || appVersion}
              onPress={() => {}}
              disabled
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.card}>
            <MenuItem
              icon="🔒"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <Divider />
            <MenuItem
              icon="📄"
              title="Terms of Service"
              onPress={handleTermsOfService}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Beta Info */}
        {isBeta && (
          <View style={styles.betaInfo}>
            <Text style={styles.betaInfoText}>
              🎉 Thank you for beta testing Buzzy!{'\n'}
              Your feedback helps us improve the app.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, disabled }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {!disabled && <Text style={styles.menuChevron}>›</Text>}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  menuChevron: {
    fontSize: 24,
    color: COLORS.text.secondary,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 24 + SPACING.md, // icon width + margins
  },
  signOutButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  signOutText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
  },
  betaInfo: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  betaInfoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: 'Poppins',
    color: COLORS.text.primary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

