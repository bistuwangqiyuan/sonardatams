/**
 * 试验数据管理Hook
 * @description 获取和管理试验数据
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Experiment } from '@/types/database';

interface UseExperimentsOptions {
  status?: string;
  limit?: number;
}

export function useExperiments(options: UseExperimentsOptions = {}) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadExperiments();
  }, [options.status, options.limit]);

  async function loadExperiments() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('ultrasonic_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      // 应用筛选条件
      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setExperiments(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('加载试验失败:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createExperiment(experimentData: Partial<Experiment>) {
    try {
      const { data, error: createError } = await supabase
        .from('ultrasonic_experiments')
        .insert(experimentData)
        .select()
        .single();

      if (createError) throw createError;

      // 刷新列表
      await loadExperiments();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  async function updateExperiment(experimentId: string, updates: Partial<Experiment>) {
    try {
      const { error: updateError } = await supabase
        .from('ultrasonic_experiments')
        .update(updates)
        .eq('id', experimentId);

      if (updateError) throw updateError;

      // 刷新列表
      await loadExperiments();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async function refreshExperiments() {
    await loadExperiments();
  }

  return {
    experiments,
    loading,
    error,
    createExperiment,
    updateExperiment,
    refreshExperiments,
  };
}

