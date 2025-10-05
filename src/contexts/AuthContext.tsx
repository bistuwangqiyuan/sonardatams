/**
 * 用户认证上下文
 * @description 支持游客模式，游客可以使用所有功能
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true); // 默认为游客模式
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查是否有现有会话
    checkUser();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsGuest(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
        setIsGuest(false);
      } else {
        // 默认为游客模式
        setIsGuest(true);
      }
    } catch (error) {
      console.error('检查用户失败:', error);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('ultrasonic_system_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      setIsGuest(false);
    } catch (error) {
      console.error('加载用户资料失败:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      // 注册用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('注册失败');

      // 创建用户资料
      const { error: profileError } = await supabase
        .from('ultrasonic_system_users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: 'viewer', // 默认为查看者角色
        });

      if (profileError) throw profileError;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsGuest(true);
    } catch (error) {
      console.error('登出失败:', error);
    }
  }

  function continueAsGuest() {
    setIsGuest(true);
    setUser(null);
    setLoading(false);
  }

  const value = {
    user,
    isGuest,
    loading,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
}

