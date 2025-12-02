import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { Profile } from '../types';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await createProfile(userId);
        } else {
          logger.error('Error fetching profile:', error);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      logger.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId }])
        .select()
        .single();

      if (error) {
        logger.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      logger.error('Error in createProfile:', error);
    }
  };

  const signIn = async (email: string) => {
    logger.log('📧 Sending magic link via SendGrid with redirect: localradar://');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'localradar://',
      },
    });

    if (error) {
      logger.error('❌ Magic link error:', error);
      logger.error('Error details:', error.message);
    } else {
      logger.log('✅ Magic link sent via SendGrid - check your email!');
      logger.log('🔗 Email should contain localradar:// redirect URL');
    }

    return { error };
  };

  const signInWithPassword = async (email: string, password: string) => {
    logger.log('🔑 Signing in with password for development...');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('❌ Password sign-in error:', error);
    } else {
      logger.log('✅ Password sign-in successful!');
    }

    return { error };
  };

  const signUpWithPassword = async (email: string, password: string) => {
    logger.log('📝 Creating account with password...');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      logger.error('❌ Password sign-up error:', error);
    } else {
      logger.log('✅ Account created successfully!');
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    refreshProfile,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}