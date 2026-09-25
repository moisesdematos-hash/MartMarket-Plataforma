import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password?: string, fullName?: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('martmarket_session_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem('martmarket_guest_v2') === 'true');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to wait for session init
  const [authError, setAuthError] = useState<string | null>(null);

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

  const loadUserProfile = async (sessionUser: any) => {
    try {
      setAuthError(null);
      // Ensure we have a profile in the DB (for Google logins where trigger might be missing)
      let { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile not found, create one automatically
        const newProfile = {
          id: sessionUser.id,
          email: sessionUser.email,
          full_name: sessionUser.user_metadata?.full_name || 'Utilizador',
          avatar_url: sessionUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
          role: 'CREATOR_AFFILIATE',
          language: 'pt',
          country: 'AO',
          currency: 'AOA',
          is_verified: true
        };
        const { data: inserted, error: insertError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (!insertError && inserted) {
          profile = inserted;
        }
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        fullName: profile?.full_name || sessionUser.user_metadata?.full_name || 'Utilizador',
        avatarUrl: profile?.avatar_url || sessionUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
        country: profile?.country || 'AO',
        language: profile?.language || 'pt',
        currency: profile?.currency || 'AOA',
        role: profile?.role || 'CREATOR_AFFILIATE',
        isVerified: profile?.is_verified ?? true,
        createdAt: profile?.created_at || new Date().toISOString()
      });
      setIsGuest(false);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setAuthError(err.message || 'Erro ao carregar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        } else if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && mounted) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setIsGuest(true);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      setAuthError('Palavra-passe obrigatória.');
      return false;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return !!data.user;
    } catch (err: any) {
      setAuthError(err.message || 'Credenciais inválidas.');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setAuthError(err.message || 'Falha ao conectar com o Google.');
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password?: string,
    fullName?: string,
    role: UserRole = 'CREATOR_AFFILIATE'
  ): Promise<boolean> => {
    if (!password) {
      setAuthError('Palavra-passe obrigatória.');
      return false;
    }
    const safeRole = role === 'ADMIN' ? 'CREATOR_AFFILIATE' : role;
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: safeRole
          }
        }
      });
      if (error) throw error;
      return !!data.user;
    } catch (err: any) {
      setAuthError(err.message || 'Falha no registo.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsGuest(true);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
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
        authError,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
