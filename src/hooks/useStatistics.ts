/**
 * 统计数据Hook
 * @description 获取系统统计数据
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Statistics {
  totalFiles: number;
  todayDetections: number;
  defectCount: number;
  passRate: number;
  detectionTypeStats: Array<{ type: string; count: number }>;
  qualityGradeStats: Array<{ grade: string; count: number }>;
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics>({
    totalFiles: 0,
    todayDetections: 0,
    defectCount: 0,
    passRate: 0,
    detectionTypeStats: [],
    qualityGradeStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      setLoading(true);
      setError(null);

      // 获取总文件数
      const { count: totalFiles } = await supabase
        .from('ultrasonic_files')
        .select('*', { count: 'exact', head: true });

      // 获取今日检测数
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayDetections } = await supabase
        .from('ultrasonic_files')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // 获取缺陷统计
      const { data: detectionData } = await supabase
        .from('ultrasonic_detection_data')
        .select('defect_count')
        .eq('defect_detected', true);

      const defectCount = detectionData?.reduce((sum, item) => sum + item.defect_count, 0) || 0;

      // 获取试验结果统计
      const { data: results } = await supabase
        .from('ultrasonic_experiment_results')
        .select('quality_grade, pass_rate');

      const totalResults = results?.length || 0;
      const passedResults = results?.filter(r => r.quality_grade !== 'reject').length || 0;
      const passRate = totalResults > 0 ? (passedResults / totalResults) * 100 : 0;

      // 获取检测类型统计（使用视图）
      const { data: typeStats } = await supabase
        .from('ultrasonic_file_statistics')
        .select('detection_type, total_files');

      // 获取质量等级统计
      const { data: gradeStats } = await supabase
        .from('ultrasonic_experiment_results')
        .select('quality_grade');

      const gradeCounts: Record<string, number> = {};
      gradeStats?.forEach(item => {
        if (item.quality_grade) {
          gradeCounts[item.quality_grade] = (gradeCounts[item.quality_grade] || 0) + 1;
        }
      });

      setStatistics({
        totalFiles: totalFiles || 0,
        todayDetections: todayDetections || 0,
        defectCount,
        passRate: Math.round(passRate * 10) / 10,
        detectionTypeStats: typeStats?.map(item => ({
          type: item.detection_type,
          count: item.total_files,
        })) || [],
        qualityGradeStats: Object.entries(gradeCounts).map(([grade, count]) => ({
          grade,
          count,
        })),
      });
    } catch (err) {
      setError(err as Error);
      console.error('加载统计数据失败:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatistics() {
    await loadStatistics();
  }

  return {
    statistics,
    loading,
    error,
    refreshStatistics,
  };
}

