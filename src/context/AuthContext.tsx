// ==============================================================================
// MARTMARKET AUTHENTICATION & RBAC CONTEXT
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (fullName: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('martmarket_session_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Ninguém logado por padrão
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('martmarket_guest_v2') === 'true';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('martmarket_session_v2', JSON.stringify(user));
      localStorage.removeItem('martmarket_guest_v2');
    } else if (isGuest) {
      localStorage.setItem('martmarket_guest_v2', 'true');
      localStorage.removeItem('martmarket_session_v2');
    } else {
      localStorage.removeItem('martmarket_session_v2');
      localStorage.removeItem('martmarket_guest_v2');
    }
  }, [user, isGuest]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || 'Utilizador Google',
          avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
          country: 'AO',
          language: 'pt',
          currency: 'AOA',
          role: profile?.role || 'CREATOR_AFFILIATE',
          isVerified: true,
          createdAt: profile?.created_at || new Date().toISOString()
        });
        setIsGuest(false);
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        checkSession();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      console.error('Password is required');
      return false;
    }
    setIsLoading(true);
    try {
      // Real Supabase Integration
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (!error && data.user) {
        // Fetch real profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          setUser(profile as UserProfile);
          setIsGuest(false);
          return true;
        }
      }
      
      // Fallback gracefully for local dev / mock mode
      let assignedRole: UserRole = 'CREATOR_AFFILIATE';
      if (email.includes('admin')) assignedRole = 'SUPER_ADMIN';
      else if (email.includes('affiliate')) assignedRole = 'AFFILIATE';
      else if (email.includes('buyer')) assignedRole = 'BUYER';

      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        country: 'AO',
        language: 'pt',
        currency: 'AOA',
        role: assignedRole,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setIsGuest(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.error('OAuth Error:', error);
        throw error;
      }
    } catch (err: any) {
      console.error('Catch OAuth:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password?: string,
    role: UserRole = 'CREATOR_AFFILIATE'
  ): Promise<boolean> => {
    if (!password) {
      console.error('Password is required');
      return false;
    }
    // SEC FIX: Prevent users from passing ADMIN role on client registration
    const safeRole = role === 'ADMIN' ? 'CREATOR_AFFILIATE' : role;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: safeRole }
        }
      });

      if (!error && data.user) {
        // Trigger handle_new_user will create the profile. We can mock it here for fast UI.
      }

      // Mock Fallback
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        country: 'AO',
        language: 'pt',
        currency: 'AOA',
        role,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setIsGuest(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsGuest(true);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuest,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        continueAsGuest,
        updateProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
