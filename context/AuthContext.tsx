'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, User, StudentProfile } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<StudentProfile>) => Promise<StudentProfile>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password?: string) => {
    console.log('[AuthContext] login() called with email:', email);
    try {
      console.log('[AuthContext] login step 1: Sending request to apiClient.login');
      const res = await apiClient.login({ email, password });
      console.log('[AuthContext] login step 2: Received response from apiClient.login:', res);

      if (res.success && res.data) {
        const token = res.data.token || (res as unknown as { token?: string }).token;
        console.log('[AuthContext] login step 3: Token extracted:', token ? '[TOKEN_EXISTS]' : '[NO_TOKEN]');

        if (token && typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          console.log('[AuthContext] login step 4: Saved token to localStorage');
        }

        console.log('[AuthContext] login step 5: Setting user state:', res.data.user);
        setUser(res.data.user);
        console.log('[AuthContext] login step 6: Setting profile state:', res.data.profile);
        setProfile(res.data.profile);
      } else {
        console.warn('[AuthContext] login failed or res.data is empty:', res);
      }
    } catch (error) {
      console.error('[AuthContext] login threw an error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    const res = await apiClient.register({ name, email, password });
    if (res.success && res.data) {
      const token = res.data.token || (res as unknown as { token?: string }).token;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      setUser(res.data.user);
      setProfile(res.data.profile);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const res = await apiClient.updateProfile(data);
    if (res.success && res.data?.profile) {
      setProfile(res.data.profile);
      return res.data.profile;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refetchUser: fetchCurrentUser,
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
