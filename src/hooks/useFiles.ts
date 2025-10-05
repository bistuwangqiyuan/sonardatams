/**
 * 文件数据管理Hook
 * @description 获取和管理超声文件数据
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UltrasonicFile } from '@/types/database';

interface UseFilesOptions {
  detectionType?: string;
  status?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export function useFiles(options: UseFilesOptions = {}) {
  const [files, setFiles] = useState<UltrasonicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadFiles();
  }, [options.detectionType, options.status, options.searchQuery, options.limit, options.offset]);

  async function loadFiles() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('ultrasonic_files')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // 应用筛选条件
      if (options.detectionType && options.detectionType !== 'all') {
        query = query.eq('detection_type', options.detectionType);
      }

      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      if (options.searchQuery) {
        query = query.ilike('file_name', `%${options.searchQuery}%`);
      }

      // 分页
      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setFiles(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err as Error);
      console.error('加载文件失败:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteFile(fileId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('ultrasonic_files')
        .delete()
        .eq('id', fileId);

      if (deleteError) throw deleteError;

      // 刷新列表
      await loadFiles();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async function refreshFiles() {
    await loadFiles();
  }

  return {
    files,
    loading,
    error,
    totalCount,
    deleteFile,
    refreshFiles,
  };
}

