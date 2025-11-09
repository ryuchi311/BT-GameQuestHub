import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, userService } from '../services/supabaseService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🔄 AuthProvider state - user:', user, 'isLoading:', isLoading);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('👤 Loading user session...');
      setIsLoading(true);
      try {
        console.log('👤 Checking for Supabase session...');
        const session = await authService.getCurrentSession();
        
        if (session?.user) {
          console.log('👤 Found authenticated session for:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('👤 No authenticated session found, using development user');
          // For development/testing, always create a user
          const devUser: User = {
            id: 'dev_user_123',
            email: 'dev@gamequesthub.com',
            name: 'Development User',
            role: 'user',
            level: 5,
            xp: 125,
            maxXp: 500,
            points: 1250,
            questsCompleted: 8,
            telegramUsername: '@devuser',
            telegramId: 123456789,
            twitterUsername: '@devuser_twitter',
            instagramUsername: 'devuser_ig',
            discordUsername: 'devuser#1234',
            createdAt: new Date().toISOString(),
          };
          setUser(devUser);
          console.log('👤 Development user set successfully:', devUser.name);
        }
      } catch (error) {
        console.error('❌ Error getting session:', error);
        // Even on error, create development user so app doesn't break
        const devUser: User = {
          id: 'dev_user_fallback',
          email: 'fallback@gamequesthub.com',
          name: 'Fallback User',
          role: 'user',
          level: 1,
          xp: 0,
          maxXp: 100,
          points: 0,
          questsCompleted: 0,
          createdAt: new Date().toISOString(),
        };
        setUser(devUser);
        console.log('👤 Fallback user set due to error:', devUser.name);
      } finally {
        console.log('👤 Setting isLoading to false');
        setIsLoading(false);
      }
    };

    // Add a small delay to see loading state, then load
    setTimeout(getSession, 100);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user has admin role in metadata
      const isAdmin = supabaseUser.user_metadata?.role === 'admin';
      
      if (isAdmin) {
        // For admin users, create profile from auth metadata
        const adminUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || 'Admin User',
          role: 'admin',
          level: 99,
          xp: 0,
          maxXp: 100,
          points: 10000,
          questsCompleted: 0,
          telegramUsername: null,
        };
        setUser(adminUser);
        return;
      }
      
      // For regular users, try to get user profile from database
      const userProfile = await userService.getUserById(supabaseUser.id);
      setUser(userProfile);
    } catch (error) {
      // If user doesn't exist in database, create a basic profile from auth data
      console.log('User not found in database, creating basic profile...');
      const basicUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        role: 'user',
        level: 1,
        xp: 0,
        maxXp: 100,
        points: 0,
        questsCompleted: 0,
        telegramUsername: supabaseUser.user_metadata?.telegram_username,
        twitterUsername: supabaseUser.user_metadata?.twitter_username,
        discordUsername: supabaseUser.user_metadata?.discord_username,
      };
      setUser(basicUser);
      
      // Optionally try to create the user in database for future use
      try {
        await userService.createUser(basicUser);
        console.log('Created user profile in database');
      } catch (createError) {
        console.log('Could not create database profile, using auth-only profile');
      }
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: supabaseUser } = await authService.signIn(email, password);
      if (supabaseUser) {
        await loadUserProfile(supabaseUser);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: Partial<User>) => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password, {
        name: userData?.name || email.split('@')[0],
        telegram_username: userData?.telegramUsername,
      });
      // User profile will be created in loadUserProfile when auth state changes
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await userService.updateUser(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      // Optimistically update the UI
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};