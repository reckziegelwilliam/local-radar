// Supabase Client Tests
// Tests for Supabase configuration

import { supabase } from '../../src/services/supabase';
import { describe, it, expect } from '@jest/globals';

describe('Supabase Client', () => {
  it('should be initialized', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.auth.signOut).toBe('function');
    expect(typeof supabase.from).toBe('function');
  });

  // Note: These tests don't actually call Supabase
  // Integration tests would be needed for full functionality testing
});

