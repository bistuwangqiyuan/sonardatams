/**
 * Supabase客户端配置
 * @description 统一的Supabase客户端实例，用于所有数据操作
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// 从环境变量获取配置
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// 验证配置
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase配置缺失！请在.env文件中设置 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase客户端实例
 * @description 用于客户端和服务端的数据操作
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'sonardatams@1.0.0',
    },
  },
});

/**
 * 服务端Supabase客户端（使用service_role密钥）
 * @description 仅在服务端使用，拥有完整的数据库访问权限
 * @warning 请勿在客户端代码中使用！
 */
export const createServerClient = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY未配置！');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * 检查用户是否已认证
 * @returns Promise<boolean>
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};

/**
 * 获取当前用户信息
 * @returns Promise<User | null>
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * 获取当前用户完整信息（包含角色等）
 * @returns Promise<User | null>
 */
export const getCurrentUserProfile = async (): Promise<any | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }

  return data;
};

/**
 * 登出
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

/**
 * 检查用户权限
 * @param requiredRole 需要的角色
 * @returns Promise<boolean>
 */
export const hasRole = async (
  requiredRole: 'admin' | 'engineer' | 'viewer'
): Promise<boolean> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;

  // 角色层级: admin > engineer > viewer
  const roleHierarchy: Record<string, number> = { admin: 3, engineer: 2, viewer: 1 };
  const userRoleLevel = roleHierarchy[profile.role as string] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
};

/**
 * 记录审计日志
 * @param action 操作名称
 * @param resourceType 资源类型
 * @param resourceId 资源ID
 * @param details 详细信息
 */
export const logAudit = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  const user = await getCurrentUser();
  if (!user) return;

  try {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || {},
      ip_address: '', // 在实际生产中从请求头获取
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    } as any);
  } catch (error) {
    console.error('记录审计日志失败:', error);
  }
};

export default supabase;

