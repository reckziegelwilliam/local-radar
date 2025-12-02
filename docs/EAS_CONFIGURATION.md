# EAS Configuration Setup

## Before Submitting to App Stores

The `eas.json` file contains placeholder values that MUST be updated before you can submit to the App Store or Play Store.

### iOS Configuration

Update the following in the `"submit"` → `"production"` → `"ios"` section:

1. **appleId**: Your Apple ID email
   - Example: `"john.doe@example.com"`
   - This is the email you use to log in to App Store Connect

2. **ascAppId**: Your App Store Connect App ID
   - Find this at: https://appstoreconnect.apple.com
   - Go to "My Apps" → Select your app → Look at the URL
   - Example: If URL is `.../apps/1234567890/...`, use `"1234567890"`

3. **appleTeamId**: Your Apple Developer Team ID
   - Find this at: https://developer.apple.com/account
   - Go to "Membership" section
   - Look for "Team ID"
   - Example: `"ABC123XYZ"`

### Android Configuration

1. **serviceAccountKeyPath**: Path to your Google Play Service Account JSON key
   - Create a service account at: https://play.google.com/console → Setup → API access
   - Download the JSON key file
   - Place it in your project root (e.g., `./google-play-service-account.json`)
   - ⚠️ **IMPORTANT**: Add this file to `.gitignore` - NEVER commit it to version control!

2. **track**: Distribution track
   - Options: `"production"`, `"beta"`, `"alpha"`, `"internal"`
   - For first release, use `"internal"` or `"beta"` for testing
   - Change to `"production"` when ready for public release

## Example Configuration

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "john.doe@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123XYZ"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## Testing Builds Before Production

### iOS TestFlight

```bash
# Build for TestFlight
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest
```

### Android Internal Testing

```bash
# Build for internal testing
eas build --platform android --profile production

# Submit to internal track
eas submit --platform android --track internal --latest
```

## Common Issues

### iOS: "Invalid credentials"
- Double-check your Apple ID, App ID, and Team ID
- Ensure you have App Manager or Admin role in App Store Connect
- Try logging in to App Store Connect to verify access

### Android: "Service account authentication failed"
- Verify the JSON key file path is correct
- Ensure the service account has "Release Manager" role
- Check that API access is enabled for your app

### Build fails with "Missing credentials"
- Run `eas credentials` to set up credentials manually
- Follow the interactive prompts
- Credentials are stored securely in EAS

## Security Notes

- ⚠️ Never commit the Google Play service account JSON to version control
- ⚠️ Never share your service account key publicly
- ⚠️ Rotate service account keys if they're ever exposed
- ✅ Use EAS Secrets for sensitive values when possible

## References

- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- EAS Submit Documentation: https://docs.expo.dev/submit/introduction/
- Apple Developer Portal: https://developer.apple.com/account
- Google Play Console: https://play.google.com/console

