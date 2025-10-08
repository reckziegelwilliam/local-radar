import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';

export class DeepLinkHandler {
  private static isHandlingLink = false;

  static async initialize() {
    // Handle initial URL if app was opened via deep link
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      this.handleUrl(initialUrl);
    }

    // Listen for incoming URLs while app is running
    const subscription = Linking.addEventListener('url', (event: any) => {
      this.handleUrl(event.url);
    });

    return subscription;
  }

  static async handleUrl(url: string) {
    if (this.isHandlingLink) return;
    this.isHandlingLink = true;

    try {
      console.log('🔗 Handling deep link:', url);

      // Handle localhost URLs from Supabase built-in email (development workaround)
      if (url.includes('localhost') && (url.includes('access_token=') || url.includes('refresh_token='))) {
        console.log('⚠️ Detected localhost URL from Supabase built-in email service');
        // Convert localhost URL to proper app scheme for processing
        const convertedUrl = url.replace(/https?:\/\/localhost(:\d+)?/, 'localradar://');
        console.log('🔄 Converting to:', convertedUrl);
        await this.handleAuthCallback(convertedUrl);
        return;
      }

      // Check if it's a Supabase auth callback
      // Look for access_token in either fragment (#) or query (?) parameters
      if (url.includes('access_token=') || url.includes('refresh_token=')) {
        await this.handleAuthCallback(url);
      } else {
        console.log('URL does not contain auth tokens, skipping auth handling');
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    } finally {
      this.isHandlingLink = false;
    }
  }

  private static async handleAuthCallback(url: string) {
    try {
      console.log('Processing auth callback URL:', url);
      
      // Extract the fragment/query part with auth tokens
      // Supabase magic links can come in different formats
      let params: URLSearchParams;
      
      if (url.includes('#')) {
        // Fragment-based parameters (most common for Supabase)
        const fragment = url.split('#')[1];
        params = new URLSearchParams(fragment);
      } else if (url.includes('?')) {
        // Query-based parameters
        const query = url.split('?')[1];
        params = new URLSearchParams(query);
      } else {
        console.log('No auth parameters found in URL');
        return;
      }
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const tokenType = params.get('token_type');
      
      console.log('Extracted tokens:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        tokenType 
      });

      if (accessToken && refreshToken) {
        console.log('Setting Supabase session...');
        
        // Set the session in Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          console.error('Session error details:', error.message);
        } else {
          console.log('Successfully authenticated via magic link');
          console.log('Session data:', data?.session?.user?.email);
          // The useAuth hook will automatically detect this change
        }
      } else {
        console.log('Missing required tokens for authentication');
        if (!accessToken) console.log('Missing access_token');
        if (!refreshToken) console.log('Missing refresh_token');
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
    }
  }
}
